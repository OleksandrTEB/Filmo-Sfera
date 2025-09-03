import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Path} from '../path/path';
import {firstValueFrom} from 'rxjs';
import {ResponseReview} from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReviewServices {
  constructor(private http: HttpClient, private path: Path) {}

  async addReview(text: string, rating: number): Promise<boolean> {
    const body = {
      text,
      rating
    }

    const response = await firstValueFrom(
      this.http.post(`${this.path.baseUrl}addReview`, body, {
        withCredentials: true
      }))
    return !!response;
  }

  async getReview(): Promise<ResponseReview> {
    return firstValueFrom(
      this.http.get<ResponseReview>(`${this.path.baseUrl}getReview`, {
        withCredentials: true
      }))
  }

  async searchReviewFromDelete(): Promise<ResponseReview> {
    return firstValueFrom(
      this.http.post<ResponseReview>(
        `${this.path.baseUrl}searchReviewFromDelete`, {}, {
          withCredentials: true
        }))
  }

  async deleteReview(id: number): Promise<boolean> {
    const body = {
      id
    }
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(`${this.path.baseUrl}deleteReview`, body, {
        withCredentials: true
      })
    )
    return response.success
  }
}
