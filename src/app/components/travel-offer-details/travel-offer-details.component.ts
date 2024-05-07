import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, shareReplay, switchMap} from "rxjs";
import {AsyncPipe, NgClass, NgForOf, NgIf, TitleCasePipe, ViewportScroller} from "@angular/common";
import {HotelRoomComponent} from "./hotel/room/hotel-room.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SearchRequestService} from "../../services/search-request.service";


@Component({
  selector: 'app-travel-offer-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    TitleCasePipe,
    HotelRoomComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './travel-offer-details.component.html',
  styleUrl: './travel-offer-details.component.css'
})
export class TravelOfferDetailsComponent implements OnInit {

  travelOfferDetails: Observable<any>;
  displayedReviews = 3;
  isAddingReview = false;
  reviewForm: FormGroup;
  offerId: string;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private fb: FormBuilder,
    private searchRequestService: SearchRequestService
  ) {
  }

  ngOnInit(): void {
    this.travelOfferDetails = this.getTravelOfferDetails().pipe(shareReplay(1));

    this.reviewForm = this.fb.group({
      comment: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  toggleReviewForm(show: boolean): void {
    this.isAddingReview = show;
    this.reviewForm.reset();
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.value;
      this.httpService.put(`http://localhost:8765/offerReviews/add/${this.offerId}`, reviewData).subscribe({
        next: (response) => {
          console.log('Review added', response);
          this.toggleReviewForm(false);
          this.travelOfferDetails = this.getTravelOfferDetails().pipe(shareReplay(1));
        },
        error: (error) => {
          console.error('Error adding review', error);
        }
      });
    }
  }

  getTravelOfferDetails(): Observable<any> {
    return this.route.params.pipe(
      switchMap(params => {
        this.offerId = params['id'];
        const request = this.searchRequestService.getScope();
        return this.httpService.get(`http://localhost:8765/offers/${this.offerId}?dateFrom=${request.dateFrom}&dateTo=${request.dateTo}`);
      })
    );
  }

  getLastReviews(reviews: any): Array<any> {
    return reviews.slice(0, this.displayedReviews);
  }

  getMoreReviews(): void {
    this.displayedReviews += 5;
  }

  getHotelRating(reviews: Array<any>): string {
    if (reviews.length === 0) {
      return '0';
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    return (totalRating / reviews.length).toFixed(2);
  }

  getTopReviews(reviews: any[]): any[] {
    return reviews.sort((a, b) => b.rating - a.rating).slice(0, 3);
  }

  scrollToReviews(): void {
    this.viewportScroller.scrollToAnchor('reviews');
  }

  cutReviewText(reviewText: string): string {
    return reviewText.length > 130 ? reviewText.slice(0, 130) + '...' : reviewText;
  }

  rate(star: number): void {
    this.reviewForm.get('rating')?.setValue(star);
  }

}
