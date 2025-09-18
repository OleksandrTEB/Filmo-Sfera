import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FilmInfo, Comment} from '../../../models/interfaces';
import {Loadfilms} from '../../../services/loadfilms/loadfilms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CommentService} from '../../../services/comments/comment.service';
import {PreloaderService} from '../../../services/preloader/preloader';
import {ConnSocket} from '../../../services/WebService/WebService';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-films-info-page',
  standalone: false,
  templateUrl: './films-info-page.html',
  styleUrl: './films-info-page.scss'
})
export class FilmsInfoPage implements OnInit {
  filmId!: number;
  film!: FilmInfo;
  safeTrailerUrl!: SafeResourceUrl;

  comments: Comment[] = [];

  ocena: number = 0;
  arrOcena: number[] = [];

  msg: string = 'getcomment'
  wsSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    public LoadFilms: Loadfilms,
    public sanitizer: DomSanitizer,
    public cdr: ChangeDetectorRef,
    public Comment: CommentService,
    private PreloaderService: PreloaderService,
    private router: Router,
    private connSocket: ConnSocket
  ) {
  }

  text: string = '';
  wis = false;
  dod = true;

  wiskomm() {
    this.wis = !this.wis
    this.dod = !this.dod;
  }

  async wyslij() {
    this.wis = false;
    this.dod = !this.dod;
    if (this.text == '') {
      return;
    }
    await this.Comment.addComment(this.text);

    await this.getComm()


    this.text = '';

    await this.connSocket.connSocket({type: this.msg});
    this.cdr.detectChanges();
  }


  play(id: number) {
    this.PreloaderService.show()

    setTimeout(async () => {
      await this.router.navigate(['/watch', id]);
      this.PreloaderService.hide()
    }, 2000)
  }

  async getComm() {
    const response = await this.Comment.getComments();
    this.comments = response.comments;
  }

  async ngOnInit() {
    await this.connSocket.connSocket({type: this.msg});
    this.wsSubscription = this.connSocket.messages$.subscribe(async (data) => {
      if (data.type === 'getcomment') {
        await this.getComm();
        this.cdr.detectChanges();
      }
    })

    this.filmId = +this.route.snapshot.paramMap.get('id')!;
    this.film = await this.LoadFilms.getFilmById(this.filmId);


    this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.film.trailer)

    const response = await this.Comment.getComments();
    this.comments = response.comments;

    this.ocena = this.film.rating
    this.arrOcena = Array.from({ length: this.ocena }, (_, i) => i)

    this.cdr.detectChanges()
  }
}
