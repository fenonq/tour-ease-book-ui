import {Component, OnInit} from '@angular/core';
import {SearchRequestService} from "../../services/search-request.service";
import {HttpService} from "../../services/http.service";
import {Observable, shareReplay} from "rxjs";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {HotelComponent} from "./hotel/hotel.component";
import {GetOffersRequest} from "../trip-flow/trip-flow.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-travel-offers',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    HotelComponent,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './travel-offers.component.html',
  styleUrl: './travel-offers.component.css'
})
export class TravelOffersComponent implements OnInit {

  travelOffers: Observable<any>;
  getTravelOffersRequest: GetOffersRequest;
  searchForm: FormGroup;
  locations: string[] = ['Location 1', 'Location 2', '2'];

  constructor(
    private formBuilder: FormBuilder,
    private searchRequest: SearchRequestService,
    private httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadOffers();
  }

  initSearchForm() {
    this.searchForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      location: ['', Validators.required]
    });

    // Ініціалізація значень форми з поточними критеріями пошуку
    const currentCriteria = this.searchRequest.getScope();
    if (currentCriteria) {
      this.searchForm.patchValue({
        dateFrom: currentCriteria.dateFrom,
        dateTo: currentCriteria.dateTo,
        location: currentCriteria.location
      });
    }
  }

  loadOffers(): void {
    this.getTravelOffersRequest = this.searchRequest.getScope();
    this.travelOffers = this.getTravelOffers().pipe(shareReplay(1));
  }

  getTravelOffers(): Observable<any> {
    return this.httpService.post('http://localhost:8765/offers', this.getTravelOffersRequest);
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.searchRequest.setScope({...this.searchForm.value, vendorType: 1});
      this.loadOffers();
    }
  }

}
