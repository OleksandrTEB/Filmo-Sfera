import {Injectable} from '@angular/core';
import {Path} from '../path/path';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {BaseResponse, CountReview, UserFilms, UserNameResponse} from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  constructor(protected http: HttpClient, protected path: Path) {
  }

  async getUserName(): Promise<UserNameResponse> {
    return await firstValueFrom(
      this.http.get<UserNameResponse>(`${this.path.baseUrl}displayName`, {
        withCredentials: true
      })
    );
  }


//   ----------------changeUsername-------------------

  async changeUsername(username: string):  Promise<boolean> {
    const body = {
      username
    };

    const response = await firstValueFrom(
      this.http.post<{ nickname: string }>(`${this.path.baseUrl}changeusername`, body, {
        withCredentials: true
      })
    )
    return !!response;
  }

  //   ----------------uploadAvatar-------------------

  async uploadAvatar(image: string, name: string): Promise<boolean> {
    const body = {
      image,
      name
    }

    const response = await firstValueFrom(
      this.http.put<BaseResponse>(`${this.path.baseUrl}uploadAvatar`, body, {
        withCredentials: true
      }))
    return response.success;
  }

//   ------------------displayAvatar-----------------

  async displayAvatar() : Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ avatar: string }>(`${this.path.baseUrl}displayAvatar`, {
        withCredentials: true
      }))
    return response.avatar;
  }


//--------------------count Review-------------------

  async countReview(): Promise<CountReview> {
    return firstValueFrom(
      this.http.get<CountReview>(`${this.path.baseUrl}countReview`, {
        withCredentials: true
      })
    )
  }

//---------------------userFilms---------------

  async userFilms(): Promise<UserFilms> {
    return firstValueFrom(
      this.http.get<UserFilms>(`${this.path.baseUrl}userFilms`, {
        withCredentials: true
      }))
  }
}



