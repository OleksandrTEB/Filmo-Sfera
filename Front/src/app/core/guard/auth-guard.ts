import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import { Injectable } from '@angular/core';
import {BaseResponse} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,
              private router: Router,) {}
  async canActivate(): Promise<boolean> {

    const isLoggedIn = await this.auth.checkCookie();
    if (!isLoggedIn) {
      await this.router.navigateByUrl('/login');
      return false
    }
    return true
  }
}
