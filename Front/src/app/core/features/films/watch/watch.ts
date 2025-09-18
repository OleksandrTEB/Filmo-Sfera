import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Loadfilms} from '../../../services/loadfilms/loadfilms';
import {FilmInfo, listReview} from '../../../models/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ReviewServices} from '../../../services/review/review';
import {ConnSocket} from '../../../services/WebService/WebService';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-watch',
  standalone: false,
  templateUrl: './watch.html',
  styleUrl: './watch.scss',
})

export class ClassWatch implements OnInit {
  filmId!: number;
  film!: FilmInfo;
  video!: SafeResourceUrl;

  reviews!: listReview[];
  arrStars: number[] = [1, 2, 3, 4, 5];

  msg: string = 'getrewiev'
  wsSubscription!: Subscription;

  constructor(
    public Loadfilms: Loadfilms,
    public route: ActivatedRoute,
    public router: Router,
    public sanitizer: DomSanitizer,
    public ReviewServices: ReviewServices,
    public cdr: ChangeDetectorRef,
    private connSocket: ConnSocket
  ) {
  }

  async getReview() {
    const response = await this.ReviewServices.getReview();
    this.reviews = response.reviews;
    this.cdr.detectChanges()
  }

  async ngOnInit() {
    await this.connSocket.connSocket({type: this.msg});
    this.wsSubscription = this.connSocket.messages$.subscribe(async (data) => {
      if (data.type === 'getrewiev') {
        await this.getReview();
        this.cdr.detectChanges();
      }
    })

    this.filmId = +this.route.snapshot.paramMap.get('id')!;
    this.film = await this.Loadfilms.getFilmById(this.filmId);

    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(this.film.video)

    const response = await this.ReviewServices.getReview();
    this.reviews = response.reviews;
    this.cdr.detectChanges()
  }

  addReview = false;
  add = true
  text: string = ''

  review() {
    this.addReview = true;
    this.add = false;
  }


  selectedRating = 0;

  setStar(star: number) {
    this.selectedRating = star
  }


  async sendReview() {
    this.addReview = false;
    this.add = true;
    if (this.text == '') {
      return;
    }
    await this.ReviewServices.addReview(this.text, this.selectedRating);
    this.text = '';
    this.selectedRating = 0;

    await this.connSocket.connSocket({type: this.msg});
    await this.getReview()
  }
}
