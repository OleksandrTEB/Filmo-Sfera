import {ChangeDetectorRef, Component} from '@angular/core';
import {UploadFilmsService} from '../../services/upload-films/film.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage {
  filmPhoto = ''

  constructor(
    public UploadFilmsService: UploadFilmsService,
    public cdr: ChangeDetectorRef,
    ) {}


  selectedFile: File | null = null;
  base64Image: string | null = null;
  title:       string = '';
  genre:       string = '';
  year:        string = '';
  description: string = '';
  trailer:     string = '';
  video:       string = '';


  onFilmPhoto(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files?.length) {

      this.selectedFile = input.files[0];
      this.filmPhoto = `./assets/photo-film/${this.selectedFile.name}`;
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        this.base64Image = result.split(',')[1];
        this.cdr.detectChanges();
      }
      reader.readAsDataURL(this.selectedFile);
    }
    this.cdr.detectChanges();
  }

  async uploadFilm() {
    if (!this.base64Image || !this.selectedFile) return;
    await this.UploadFilmsService.uploadFIlm(
        this.base64Image,
        this.selectedFile.name,
        this.title,
        this.year,
        this.genre,
        this.description,
        this.trailer,
        this.video
        )
    window.location.reload();
  }
}
