import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Path} from '../path/path';
import {firstValueFrom} from 'rxjs';
import {FilmInfo, FilmsResponse} from '../../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class Films {
  constructor(private http: HttpClient, private path: Path) {
  }

  async uploadFIlm(imageFilm: string, name: string, title: string, year: string, genre: string, description: string, trailer: string, video: string): Promise<boolean> {
    const body = {
      imageFilm,
      name,
      title,
      genre,
      year,
      description,
      trailer,
      video
    }

    const response = await firstValueFrom(
      this.http.put<{ success: boolean }>(`${this.path.baseUrl}uploadFilm`, body, {
        withCredentials: true
      }))
    return response.success;
  }


  async loadFilms(): Promise<FilmsResponse> {
    return firstValueFrom(
      this.http.get<FilmsResponse>(`${this.path.baseUrl}loadFilm`, {
        withCredentials: true
      })
    )
  }


  async getFilmById(filmId: number): Promise<FilmInfo> {
    const body = {
      filmId
    }
    return firstValueFrom(
      this.http.post<FilmInfo>(`${this.path.baseUrl}searchFilm`, body, {
        withCredentials: true
      }));
  }
}
