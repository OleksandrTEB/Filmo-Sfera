import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {ErrorResponse} from '../../../models/interfaces';
import {PreloaderService} from '../../../services/preloader/preloader';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: 'login-page.html',
  styleUrl: 'login-page.scss',
  imports: [
    FormsModule
  ]
})


export class loginPage implements OnInit {
  email: string = '';
  password: string = '';
  isError: boolean = false;
  message: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private PreloaderService: PreloaderService
  ) {}

  rout() {
    this.PreloaderService.show()

    setTimeout(() => {
      this.router.navigateByUrl('/register')
      this.PreloaderService.hide()
    }, 1000)
  }

  async onLogin() {
    try {
      const response: ErrorResponse = await this.auth.login(
        this.email,
        this.password
      )

      if (response.verified === false) {
        await this.router.navigateByUrl('/verification')
        await this.auth.postMessage()

        return
      }

      if (response.success || response.admin) {
        this.PreloaderService.show()

        setTimeout(() => {
          this.router.navigateByUrl('/profile')
          this.PreloaderService.hide()
        }, 1000)
      }

    } catch (error: any) {
      if (error.error) {
        this.message = error.error.message
        this.isError = true;
      } else {
        this.isError = false;
      }

      this.cdr.detectChanges()
    }

    localStorage.setItem('email', this.email);
  }

  async ngOnInit() {
    this.email = localStorage.getItem('email') ?? '';
    this.cdr.detectChanges();
  }
}
