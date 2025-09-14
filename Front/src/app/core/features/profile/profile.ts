import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserInfoService} from '../../services/user-info/user-info.service';
import {CountReview, Films, UserFilms} from '../../models/interfaces';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  review: number = 0;
  is: boolean = false;
  drop: boolean = false;

  userFilms: Films[] = [];

  constructor(
    public UserInfoService: UserInfoService,
    public cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    const response: CountReview = await this.UserInfoService.countReview()
    this.review = response.count_reviews;

    const respon: UserFilms = await this.UserInfoService.userFilms()

    this.userFilms = respon.films

    if (response.count_reviews != 0) {
      this.is = true;
    }

    this.cdr.detectChanges();
  }

  dropFn() {
    this.drop = !this.drop;
  }

  selectFilms: Films | null | undefined = null;

  selected: string = '';

  selectFilm(title: string) {
    this.selected = title;
  }

  show() {
    this.selectFilms = this.userFilms.find(film => film.film_title === this.selected)
    this.drop = false;
  }

  selectedIndex: number | null = null;

  addStyle(index: number) {
    this.selectedIndex = index;
  }
}
