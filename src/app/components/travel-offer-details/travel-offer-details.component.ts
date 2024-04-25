import {Component, OnInit} from '@angular/core';
import {SearchRequestService} from "../../services/search-request.service";
import {HttpService} from "../../services/http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, shareReplay, switchMap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import $ from "jquery";


@Component({
  selector: 'app-travel-offer-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    TitleCasePipe
  ],
  templateUrl: './travel-offer-details.component.html',
  styleUrl: './travel-offer-details.component.css'
})
export class TravelOfferDetailsComponent implements OnInit {

  travelOfferDetails: Observable<any> | undefined;
  displayedReviews = 3;

  constructor(
    private searchRequest: SearchRequestService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.travelOfferDetails = this.getTravelOfferDetails().pipe(shareReplay(1));
  }

  getTravelOfferDetails(): Observable<any> {
    return this.route.params.pipe(
      switchMap(params => {
        const offerId = params['id'];
        return this.httpService.get(`http://localhost:8765/getOffer/${offerId}`);
      })
    );
  }

  getLastReviews(reviews: any): Array<any> {
    return reviews.slice(0, this.displayedReviews);
  }

  getMoreReviews() {
    this.displayedReviews += 5;

    console.log(this.displayedReviews)

  }

  getHotelRating(reviews: Array<any>): number {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    return totalRating / reviews.length;
  }



}
