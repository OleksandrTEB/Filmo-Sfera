import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {PreloaderService} from '../../../services/preloader/preloader';


@Component({
  selector: 'app-register',
  templateUrl: 'register-page.html',
  styleUrls: ['register-page.scss'],
  imports: [
    FormsModule
  ]
})
export class registerPage {
  checkboxStatus: boolean = false;

  messageEmail: string | undefined = '';
  messagePassword: string | undefined = '';
  messageUsername: string | undefined = '';
  messageAlready: string | undefined = '';

  isErrorEmail: boolean = false;
  isErrorPassword: boolean = false;
  isErrorUsername: boolean = false;
  isErrorAlready: boolean = false;

  email = '';
  username = '';
  password = '';
  country = '';


  constructor(
    public auth: AuthService,
    private router: Router,
    public cdr: ChangeDetectorRef,
    private PreloaderService: PreloaderService
  ) {
  }


  async onRegister(event: Event) {
    event.preventDefault();

    try {
      await this.auth.register(
        this.email,
        this.password,
        this.username,
        this.country,
        this.checkboxStatus,
      );

      const resp = await this.auth.postMessage()

      if (resp.success) {
        this.PreloaderService.show()

        setTimeout(() => {
          this.router.navigateByUrl('/verification')
          this.PreloaderService.hide()
        }, 1000)
        localStorage.setItem('email', this.email);
        return;
      }
    } catch (error: any) {
      if (error.error) {
        if (error.error.isErrorEmail) {
          this.messageEmail = error.error.messageEmail;
          this.isErrorEmail = true;
        }
        if (!error.error.isErrorEmail) {
          this.isErrorEmail = false;
        }

        if (error.error.isErrorPassword) {
          this.messagePassword = error.error.messagePassword;
          this.isErrorPassword = true;
        }
        if (!error.error.isErrorPassword) {
          this.isErrorPassword = false;
        }

        if (error.error.isErrorUsername) {
          this.messageUsername = error.error.messageUsername;
          this.isErrorUsername = true;
        }
        if (!error.error.isErrorUsername) {
          this.isErrorUsername = false;
        }

        if (error.error.isErrorAlready) {
          this.messageAlready = error.error.messageAlready;
          this.isErrorAlready = true;
        }
        if (!error.error.isErrorAlready) {
          this.isErrorAlready = false;
        }
        this.cdr.detectChanges();
      }
      this.cdr.detectChanges();
    }
  }
}
