import {Component, OnInit} from '@angular/core';
import {PreloaderService} from '../../services/preloader/preloader';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.html',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./preloader.scss']
})
export class PreloaderComponent implements OnInit{
  isLoading$!: Observable<boolean>;
  constructor(private PreloaderService: PreloaderService) {}

  ngOnInit() {
    this.isLoading$ = this.PreloaderService.isLoading$;
  }
}
