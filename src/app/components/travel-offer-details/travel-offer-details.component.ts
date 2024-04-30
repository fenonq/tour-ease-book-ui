import {Component, OnInit} from '@angular/core';
import {SearchRequestService} from "../../services/search-request.service";
import {HttpService} from "../../services/http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, shareReplay, switchMap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, TitleCasePipe, ViewportScroller} from "@angular/common";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {HotelRoomComponent} from "./hotel/room/hotel-room.component";


@Component({
  selector: 'app-travel-offer-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    TitleCasePipe,
    HotelRoomComponent
  ],
  templateUrl: './travel-offer-details.component.html',
  styleUrl: './travel-offer-details.component.css'
})
export class TravelOfferDetailsComponent implements OnInit {

  travelOfferDetails: Observable<any> | undefined;
  displayedReviews = 3;

  constructor(
    private searchRequest: SearchRequestService,
    private cartService: ShoppingCartService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {
  }

  ngOnInit(): void {
    this.travelOfferDetails = this.getTravelOfferDetails().pipe(shareReplay(1));

    console.log(this.cartService.getCart());
  }

  getTravelOfferDetails(): Observable<any> {
    return this.route.params.pipe(
      switchMap(params => {
        const offerId = params['id'];
        return this.httpService.get(`http://localhost:8765/offers/${offerId}`);
      })
    );
  }

  getLastReviews(reviews: any): Array<any> { // todo extract reviews to the new container
    return reviews.slice(0, this.displayedReviews);
  }

  getMoreReviews(): void {
    this.displayedReviews += 5;
  }

  getHotelRating(reviews: Array<any>): number {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    return totalRating / reviews.length;
  }

  getTopReviews(reviews: any[]): any[] {
    // Сортуємо відгуки за рейтингом і беремо топ 3
    return reviews.sort((a, b) => b.rating - a.rating).slice(0, 3);
  }

  scrollToReviews(): void {
    this.viewportScroller.scrollToAnchor('reviews'); // Переміщення до елементу з id="reviews"
  }

  cutReviewText(reviewText: string): string {
    return reviewText.length > 130 ? reviewText.slice(0, 130) + '...' : reviewText;
  }

}
