import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FilmInfo } from '../../../models/interfaces';
import {Films} from '../../../services/films/films';
import {FilmComponent} from './film/film/film';

@Component({
  selector: 'app-films',
  templateUrl: './films-page.html',
  imports: [
    FilmComponent
  ],
  styleUrl: './films-page.scss'
})
export class FilmsPage implements OnInit {
  films: FilmInfo[] = [];

  constructor(
    private Films: Films,
    public cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const response = await this.Films.loadFilms();
    this.films = response.films;
    this.cdr.detectChanges();
  }
}
