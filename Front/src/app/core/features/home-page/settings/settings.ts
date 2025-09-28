import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PreloaderService} from '../../../services/preloader/preloader';
import {AuthService} from '../../../services/auth/auth.service';
import {UserInfoService} from '../../../services/user-info/user-info.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings implements OnInit {
  avatar: string = '';
  username: string = '';


  isSelectedProfile: boolean = true;
  isSelectedAccount: boolean = false;

  constructor(
    private PreloaderService: PreloaderService,
    private auth: AuthService,
    private UserInfoService: UserInfoService,
    private cdr: ChangeDetectorRef) {
  }

  selectedProfile() {
    this.isSelectedProfile = true;
    this.isSelectedAccount = false;
  }

  selectedAccount() {
    this.isSelectedAccount = true;
    this.isSelectedProfile = false;
  }

  async logout() {
    this.PreloaderService.show()

    localStorage.removeItem('avatar');
    localStorage.removeItem('username');

    setTimeout(() => {
      this.auth.logout();
      this.PreloaderService.hide()
    }, 1000)
  }


  async ngOnInit() {
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

  async saveAll() {
    await this.UserInfoService.changeUsername(this.username)
    localStorage.setItem('username', this.username);

    await this.uploadAvatar();

    this.cdr.detectChanges()

    window.location.reload();
  }

  selectedFile: File | null = null;
  base64Image: string | null = null;

  onAvatarSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    const reader = new FileReader();
    if (input.files) {
      this.selectedFile = input.files[0];
      reader.onload = () => {
        const result = reader.result as string;
        this.base64Image = result.split(',')[1];

        this.avatar = 'data:image/*;base64,' + this.base64Image;
        this.cdr.detectChanges()
      }

      reader.readAsDataURL(this.selectedFile)
    }
  }

  async uploadAvatar() {
    if (!this.base64Image || !this.selectedFile) return;

    localStorage.setItem('avatar', 'data:image/*;base64,' + this.base64Image);

    await this.UserInfoService.uploadAvatar(
      this.base64Image,
      this.selectedFile.name
    )
  }
}
