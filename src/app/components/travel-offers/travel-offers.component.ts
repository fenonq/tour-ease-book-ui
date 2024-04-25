import {Component, OnInit} from '@angular/core';
import {SearchRequestService} from "../../services/search-request.service";
import {HttpService} from "../../services/http.service";
import {min, Observable, of, shareReplay} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {HotelComponent} from "./hotel/hotel.component";

@Component({
  selector: 'app-travel-offers',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    HotelComponent
  ],
  templateUrl: './travel-offers.component.html',
  styleUrl: './travel-offers.component.css'
})
export class TravelOffersComponent implements OnInit {

  travelOffers: Observable<any> | undefined;
  vendor: any;

  constructor(
    private searchRequest: SearchRequestService,
    private httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.travelOffers = this.getTravelOffers().pipe(shareReplay(1));
  }

  getTravelOffers(): Observable<any> {
    const rq = this.searchRequest.getScope();
    this.vendor = rq.vendorType;

    return this.httpService.post('http://localhost:8765/getOffers', rq);
  }

}
