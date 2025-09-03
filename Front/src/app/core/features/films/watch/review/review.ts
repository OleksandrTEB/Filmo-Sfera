import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {listReview} from '../../../../models/interfaces';
import {AdminGuard} from '../../../../guard/admin-guard';
import {ReviewServices} from '../../../../services/review/review';
import {ConnSocket} from '../../../../services/WebService/WebService';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.html',
  styleUrl: './review.scss'
})
export class Review implements OnInit {
  @Input() public review!: listReview;

  result = false;

  rating: number = 1;
  arrRating: number[] = [];

  msg: string = 'getrewiev';

  constructor(
    public ReviewServices: ReviewServices,
    public cdr: ChangeDetectorRef,
    public AdminGuard: AdminGuard,
    private connSocket: ConnSocket
  ) {
  }



  async ngOnInit() {
    const response = await this.ReviewServices.searchReviewFromDelete()
    if (response.success && response.reviews) {
      this.result = response.reviews.some(r => r.id === this.review.id)
    }

    this.rating = this.review.rating

    this.arrRating = Array.from({ length: this.rating }, (_, i) => i)



    const admin = await this.AdminGuard.canActivate()
    if (admin) {
      this.result = true
    }


    this.cdr.detectChanges()
  }

  async deleteReview() {
    await this.ReviewServices.deleteReview(this.review.id);
    this.connSocket.messages$.next({type: this.msg});
    await this.connSocket.connSocket({type: this.msg});
  }
}
