import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpService} from "../../services/http.service";
import {SearchRequestService} from "../../services/search-request.service";
import {Router} from "@angular/router";

export interface GetOffersRequest {
  vendorType: number;
  location: number;
  dateFrom: Date;
  dateTo: Date;
}

@Component({
  selector: 'app-trip-flow',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgClass,
    NgForOf
  ],
  templateUrl: './trip-flow.component.html',
  styleUrl: './trip-flow.component.css'
})
export class TripFlowComponent implements OnInit {

  hotelSearchForm: FormGroup;
  locations: string[] = ['Location 1', 'Location 2', '2']; // todo add locations to the database, create new container for them
  selectedForm: string = 'hotel';

  constructor(
    private formBuilder: FormBuilder,
    private searchRequest: SearchRequestService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initSearchForm();
  }

  initSearchForm(): void {
    this.hotelSearchForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  toggleForm(formType: string): void {
    this.selectedForm = formType;
  }

  isHotelFormSelected(): boolean {
    return this.selectedForm === 'hotel';
  }

  isActivityFormSelected(): boolean {
    return this.selectedForm === 'activity';
  }

  onSubmit() {
    if (this.hotelSearchForm.invalid) {
      return;
    }

    this.searchRequest.setScope({...this.hotelSearchForm.value, vendorType: 1});
    this.router.navigate(['/travelOffers'])
    console.log('Search parameters:', this.hotelSearchForm.value);
  }

}
