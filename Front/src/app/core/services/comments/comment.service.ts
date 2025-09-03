import { Injectable } from '@angular/core';
import {Path} from '../path/path';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ResponseComments} from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(
    public http: HttpClient,
    public path: Path,
  ) {}

  async addComment(text: string): Promise<Boolean> {
    const body = {
      text,
    }


    const response = await firstValueFrom(
      this.http.post(`${this.path.baseUrl}addcomm`, body, {
        withCredentials: true
      }))
    return !!response;
  }

  async getComments(): Promise<ResponseComments> {
    return firstValueFrom(this.http.get<ResponseComments>(`${this.path.baseUrl}getcomment`, {
      withCredentials: true
    }))
  }

  async searchCommentFromDelete(): Promise<ResponseComments> {
    return firstValueFrom(
      this.http.post<ResponseComments>(
        `${this.path.baseUrl}searchCommentFromDelete`, {}, {
          withCredentials: true
      }))
  }


  async deleteComment(id: number): Promise<boolean> {
    const body = {
      id
    }
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(`${this.path.baseUrl}deleteComment`, body, {
        withCredentials: true
      })
    )
    return response.success
  }
}
