import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpService} from "../../services/http.service";
import {SearchRequestService} from "../../services/search-request.service";
import {Router} from "@angular/router";

export interface GetOffersRequest {
  // private VendorType vendorType;
  // private int locationId;
  // private LocalDate from;
  // private LocalDate to;
  vendorType: number;
  locationId: number;
  from: Date;
  to: Date;
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
  locations: string[] = ['Location 1', 'Location 2', '2'];
  selectedForm: string = 'hotel';

  constructor(private formBuilder: FormBuilder, private searchRequest: SearchRequestService, private router: Router) {
    this.hotelSearchForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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

  // get f() { return this.hotelSearchForm.controls; }

  onSubmit() {
    // Ваш код для виконання пошуку готелів за вказаними параметрами
    if (this.hotelSearchForm.invalid) {
      return;
    }

    const rq = {
      vendorType: 1,
      locationId: this.hotelSearchForm.controls['location'].value,
      from: this.hotelSearchForm.controls['dateFrom'].value,
      to: this.hotelSearchForm.controls['dateTo'].value
    } as GetOffersRequest;


    this.searchRequest.setScope(rq);
    this.router.navigate(['/travelOffers'])
    console.log('Search parameters:', this.hotelSearchForm.value);
  }

}
