import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {UserInfoService} from '../../services/user-info/user-info.service';
import {PreloaderService} from '../../services/preloader/preloader';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})

export class HomePage implements OnInit {
  avatar: string = '';
  username: string = '';

  constructor(private auth: AuthService,
              private router: Router,
              private UserInfoService: UserInfoService,
              private cdr: ChangeDetectorRef,
              private PreloaderService: PreloaderService,
              private elementRef: ElementRef
  ) {
  }


  isOpenMenu = false;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOpenMenu = !this.isOpenMenu;
    this.changeAvatar = false;
    this.changeUsername = false;
  }

  changeUsername = false;


  changeAvatar = false;

  home() {
    this.PreloaderService.show()

    setTimeout(async () => {
      this.isOpenMenu = false;
      await this.router.navigate(['/profile']);
      this.PreloaderService.hide()
    }, 1000)
  }

  allFilms() {
    this.PreloaderService.show()

    setTimeout(() => {
      this.isOpenMenu = false;
      this.router.navigate(['/films']);
      this.PreloaderService.hide()
    }, 1000)
  }


  admin = false;

  async checkAdmin() {
    const response = await this.auth.isAdmin();
    if (response) {
      this.admin = true;
    }
  }

  async ngOnInit() {
    await this.checkAdmin();

    if (!localStorage.getItem('avatar')) {
      this.avatar = 'data:image/*;base64,' + await this.UserInfoService.displayAvatar()

      localStorage.setItem('avatar', this.avatar);
    } else {
      this.avatar = localStorage.getItem('avatar')!;
    }

    if (!localStorage.getItem('username')) {
      const response = await this.UserInfoService.getUserName()
      this.username = response.username;

      localStorage.setItem('username', this.username);
    } else {
      this.username = localStorage.getItem('username')!;
    }

    this.cdr.detectChanges()
  }

  async settingsToggle() {
    await this.router.navigate(['/settings']);
    this.isOpenMenu = false
  }

  async addFilm() {
    await this.router.navigateByUrl('/admin');
  }

  close() {
    this.isOpenMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpenMenu = false;
    }
  }
}
