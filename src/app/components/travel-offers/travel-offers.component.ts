import {Component, OnInit} from '@angular/core';
import {SearchRequestService} from "../../services/search-request.service";
import {HttpService} from "../../services/http.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-travel-offers',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './travel-offers.component.html',
  styleUrl: './travel-offers.component.css'
})
export class TravelOffersComponent implements OnInit {

  travelOffers: Observable<any> | undefined;

  constructor(private searchRequest: SearchRequestService, private httpService: HttpService) {
  }

  ngOnInit(): void {
    console.log( this.searchRequest.getScope())
    this.travelOffers = this.getTravelOffers();
  }

  getTravelOffers(): Observable<any> {
    const rq = this.searchRequest.getScope();

    return this.httpService.post('http://localhost:8765/getOffers', rq);
  }

}
