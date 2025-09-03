import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {UserInfoService} from '../../services/user-info/user-info.service';
import {PreloaderService} from '../../services/preloader/preloader';

@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home-page.html',
    styleUrls: ['./home-page.scss']
  })

  export class HomePage implements OnInit {
    avatar: string = '';
    username: string = '';
    NewUsername: string = '';

    constructor(private auth: AuthService,
                private router: Router,
                private userName: UserInfoService,
                private cdr: ChangeDetectorRef,
                private PreloaderService: PreloaderService,
                private elementRef: ElementRef
    ) {}



    isOpenMenu = false;

    toggleMenu(event: MouseEvent) {
      event.stopPropagation();
      this.isOpenMenu = !this.isOpenMenu;
      this.changeAvatar = false;
      this.changeUsername = false;
    }

    changeUsername = false;

    async changeUsernameToggle() {
      this.changeUsername = !this.changeUsername;
      this.changeAvatar = false;
      this.isOpenMenu = !this.isOpenMenu;

      const response = await this.userName.getUserName()
      this.NewUsername = response.username;

      this.cdr.detectChanges()
    }


    changeAvatar = false;

    changeAvatarToggle() {
      this.changeAvatar = !this.changeAvatar;
      this.changeUsername = false;
      this.isOpenMenu = !this.isOpenMenu;
    }

    home() {
      this.PreloaderService.show()

      setTimeout(() => {
        this.isOpenMenu = false;
        this.router.navigate(['/profile']);
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


    async logout() {
      this.PreloaderService.show()

      setTimeout(() => {
        this.auth.logout();
        this.PreloaderService.hide()
      }, 1000)
    }

    closeChangeName() {
      this.changeUsername = false;
    }


    async NewUsernameToggle() {

      if (this.NewUsername == '' || this.changeUsername == null) return;

      await this.changeUsernameFunction(this.NewUsername)
      this.username = this.NewUsername;
      this.changeUsername = false;
      this.isOpenMenu = false;

      this.cdr.detectChanges()
    }


    selectedFile: File | null = null;
    base64Image: string | null = null;


    onAvatarSelected(event: Event) {

      const input = event.target as HTMLInputElement;

      if (input.files) {

        this.selectedFile = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          this.base64Image = result.split(',')[1];
        }

        reader.readAsDataURL(this.selectedFile);
      }
    }


    async uploadAvatar() {
      if (!this.base64Image || !this.selectedFile) return;

      await this.userName.uploadAvatar(
        this.base64Image,
        this.selectedFile.name
      )

      this.changeAvatar = false;
      await this.displayAvatar()
      this.cdr.detectChanges();
    }

    closeAvatar() {
      this.changeAvatar = false;
    }

    async displayAvatar() {
      this.avatar = await this.userName.displayAvatar();
      this.cdr.detectChanges();
    }

    async getUserName() {
      const response = await this.userName.getUserName()
      this.username = response.username;
      this.cdr.detectChanges()
    }

    async changeUsernameFunction(name: string) {
      await this.userName.changeUsername(name);
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
      await this.displayAvatar();
      await this.getUserName();

      this.cdr.detectChanges()
    }



    addFilm() {
      this.router.navigateByUrl('/admin');
    }

    close() {
      this.isOpenMenu = false;
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!this.elementRef.nativeElement.contains(target )) {
        this.isOpenMenu = false;
      }
    }
  }
