import {Component, Input, OnInit} from '@angular/core';
import {FilmInfo} from '../../../../../models/interfaces';
import {Router} from '@angular/router';
import {PreloaderService} from '../../../../../services/preloader/preloader';

@Component({
  selector: 'app-film',
  templateUrl: './film.html',
  styleUrl: './film.scss'
})
export class FilmComponent implements OnInit {
  @Input() film!: FilmInfo;

  constructor(
    private router:Router,
    private PreloaderService: PreloaderService
  ) {}


  rating: number = 0;
  arrRating: number[] = []

  ngOnInit () {
    this.rating = this.film.rating

    this.arrRating = Array.from({ length: this.rating }, (_,i) => i)
  }

  async filmInfo(id: number) {
    this.PreloaderService.show()

    setTimeout(() => {
      this.PreloaderService.hide()
      this.router.navigate(['/filminfo', id]);
    }, 1000)
  }

  play(id: number) {
    this.PreloaderService.show()

    setTimeout(() => {
      this.PreloaderService.hide()
      this.router.navigate(['/watch', id]);
    }, 1000)
  }
}
