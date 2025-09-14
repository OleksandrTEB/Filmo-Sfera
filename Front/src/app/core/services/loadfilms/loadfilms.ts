import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FilmInfo, FilmsResponse} from '../../models/interfaces';
import {firstValueFrom} from 'rxjs';
import {Path} from '../path/path';

@Injectable({
  providedIn: 'root'
})
export class Loadfilms {
  constructor(private http: HttpClient, private path: Path) {
  }

  async loadFilms(): Promise<FilmsResponse> {
    return firstValueFrom(
      this.http.get<FilmsResponse>(`${this.path.baseUrl}loadfilm`, {
        withCredentials: true
      })
    )}


  async getFilmById(filmId: number): Promise<FilmInfo> {
    const body = {
      filmId
    }
    return firstValueFrom(
      this.http.post<FilmInfo>(`${this.path.baseUrl}searchfilm`, body, {
        withCredentials: true
      }));
    }
}
