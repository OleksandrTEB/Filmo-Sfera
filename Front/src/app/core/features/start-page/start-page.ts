import {Component, OnInit} from '@angular/core'
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';


@Component({
  selector: 'app-start',
  templateUrl: 'start-page.html',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  styleUrl: 'start-page.scss'
})

export class StartPage implements OnInit {
  show = true;

  constructor(
    public router: Router,
  ) {}

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    if (url.includes('/login') || url.includes('/register')) {
      this.show = false;
    } else {
      this.show = true;
    }
  }
}

