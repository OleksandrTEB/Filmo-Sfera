import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService
  ) {}
  async canActivate(): Promise<boolean> {
    return await this.auth.isAdmin();
  }
}
