import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FilmInfo } from '../../../models/interfaces';
import { Loadfilms } from '../../../services/loadfilms/loadfilms';
import {FilmComponent} from './film/film/film';

@Component({
  selector: 'app-films',
  templateUrl: './films-page.html',
  imports: [
    FilmComponent
  ],
  styleUrls: ['./films-page.scss']
})
export class FilmsPage implements OnInit {
  films: FilmInfo[] = [];

  constructor(
    private loadFilms: Loadfilms,
    public cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const response = await this.loadFilms.loadFilms();
    this.films = response.films;
    this.cdr.detectChanges();
  }
}
