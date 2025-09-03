import {ChangeDetectorRef, Component} from '@angular/core';
import {uploadFilmsSevise} from '../../services/upload-films/film.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage {
  filmPhoto = ''

  constructor(
    public uploadFilmsService: uploadFilmsSevise,
    public cdr: ChangeDetectorRef,
    ) {}


  selectedFile: File | null = null;
  base64Image:  string | null = null;
  nazwa:        string = '';
  gatunek:      string = '';
  rok:          string = '';
  opis:         string = '';
  zwiastun:     string = '';
  video:        string = '';


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
    const upload = await this.uploadFilmsService.uploadFIlm(
        this.base64Image,
        this.selectedFile.name,
        this.nazwa,
        this.rok,
        this.gatunek,
        this.opis,
        this.zwiastun,
        this.video
        )
    window.location.reload();
  }
}
