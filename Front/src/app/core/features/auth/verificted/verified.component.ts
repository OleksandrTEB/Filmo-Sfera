import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {PreloaderService} from '../../../services/preloader/preloader';

@Component({
  selector: 'app-verificted',
  standalone: false,
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.scss'
})
export class Verified {
  email: string = '';
  code: string = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private PreloaderService: PreloaderService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  isError: boolean = false;
  message: string = '';


  async subm() {
    const response = await this.auth.authenticate(this.code)

    if (response.success === false) {
      this.isError = true
      this.message = response.message
      this.cdr.detectChanges()

      return
    }

    if (response.success) {
      this.isError = false;
      this.PreloaderService.show()

      setTimeout(() => {
        this.router.navigateByUrl('/login')
        this.PreloaderService.hide()
      }, 1000)
    }
  }

  async postMess() {
    await this.auth.postMessage()
  }
}
