import {Component, Input, OnInit} from '@angular/core';
import {Films} from '../../../models/interfaces';
import {Router} from '@angular/router';
import {PreloaderService} from '../../../services/preloader/preloader';

@Component({
  selector: 'app-eventfilm',
  templateUrl: './eventfilm.html',
  styleUrl: './eventfilm.scss'
})
export class EventFilm implements OnInit {
  @Input() public film!: Films

  constructor(
    public router: Router,
    private PreloaderService: PreloaderService
  ) {}

  ngOnInit() {
  }

  goToFilm(id: number) {
    this.PreloaderService.show()

    setTimeout(() => {
      this.router.navigate(['/filminfo', id])
      this.PreloaderService.hide()
    }, 2000)
  }
}
