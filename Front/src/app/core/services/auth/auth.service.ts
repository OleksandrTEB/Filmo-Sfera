import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseResponse, ErrorResponse, loginRequest, registerRequest, ResponseCode} from '../../models/interfaces';
import {firstValueFrom} from 'rxjs';
import {Path} from '../path/path';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(protected http: HttpClient, protected Path: Path, private router: Router) {}

  // ----------------------------checkCookie------------------

  async checkCookie(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<BaseResponse>(`${this.Path.baseUrl}checkCookie`, {}, {
          withCredentials: true
        }));

      if (response.verified === false) {
        await this.router.navigateByUrl('/verification');
        await this.postMessage()
      }

      return (response.success || response.admin);

    } catch (error: any) {
      return false;
    }
  }


  //---------------------isAdmin--------------

  async isAdmin(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<BaseResponse>(`${this.Path.baseUrl}checkCookie`, {}, {
          withCredentials: true
        }));
      return response.admin
    } catch (error: any) {
      return false
    }

  }

  //------------------------register------------------

  async register(email: string, password: string, username: string, country: string, checkboxStatus: boolean): Promise<ErrorResponse> {
      const body: registerRequest = {
        email,
        password,
        username,
        country,
        checkboxStatus
      }

      return await firstValueFrom(
        this.http.post<ErrorResponse>(`${this.Path.baseUrl}register`, body, {
          withCredentials: true
        }));
    }

    async authenticate(code: string): Promise<ResponseCode> {
        const body = {
          code
        }

        return await firstValueFrom(
          this.http.post<ResponseCode>(`${this.Path.baseUrl}authenticate`, body, {
            withCredentials: true
        }))
    }

    async postMessage(): Promise<BaseResponse> {
      return  await firstValueFrom(
        this.http.post<BaseResponse>(`${this.Path.baseUrl}postMessage`, {}, {
          withCredentials: true
        }))
    }

  //------------------------login------------------

  async login(email: string, password: string): Promise<ErrorResponse> {
    const body: loginRequest = {
      email,
      password
    }
    return await firstValueFrom(
      this.http.post<ErrorResponse>(`${this.Path.baseUrl}login`, body, {
        withCredentials: true
      }))
  }


  //------------------------logout------------------

  async logout(): Promise<BaseResponse> {
    const response: BaseResponse = await firstValueFrom(
      this.http.post<BaseResponse>(`${this.Path.baseUrl}logout`, {}, {
      withCredentials: true
    }))

    if (response.success) {
      await this.router.navigate(['/login']);
    }
    return response;
  }
}


