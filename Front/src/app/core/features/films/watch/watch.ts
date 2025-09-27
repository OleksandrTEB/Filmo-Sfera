import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Films} from '../../../services/films/films';
import {FilmInfo, listReview} from '../../../models/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ReviewServices} from '../../../services/review/review';

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


  constructor(
    public Films: Films,
    public route: ActivatedRoute,
    public router: Router,
    public sanitizer: DomSanitizer,
    public ReviewServices: ReviewServices,
    public cdr: ChangeDetectorRef,
  ) {
  }

  async getReview() {
    const response = await this.ReviewServices.getReview();
    this.reviews = response.reviews;

    this.cdr.detectChanges()
  }

  async ngOnInit() {
    this.filmId = +this.route.snapshot.paramMap.get('id')!;
    this.film = await this.Films.getFilmById(this.filmId);

    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(this.film.video)


    await this.getReview()

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

    await this.getReview()

    this.cdr.detectChanges()
  }
}
