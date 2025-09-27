import {ChangeDetectorRef, Component} from '@angular/core';
import {Films} from '../../services/films/films';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage {
  constructor(
    public Films: Films,
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

    if (input.files) {

      this.selectedFile = input.files[0];
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
    await this.Films.uploadFIlm(
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
