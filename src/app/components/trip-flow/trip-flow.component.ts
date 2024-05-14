import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpService} from "../../services/http.service";
import {SearchRequestService} from "../../services/search-request.service";
import {Router} from "@angular/router";
import {Observable, shareReplay} from "rxjs";
import {Location} from "../../models/core";

@Component({
  selector: 'app-trip-flow',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './trip-flow.component.html',
  styleUrl: './trip-flow.component.css'
})
export class TripFlowComponent implements OnInit {

  hotelSearchForm: FormGroup;
  locations: Observable<Array<Location>>;
  selectedForm: string = 'hotel';

  constructor(
    private formBuilder: FormBuilder,
    private searchRequest: SearchRequestService,
    private router: Router,
    private httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.getLocations();
  }

  getLocations(): void {
    this.locations = this.httpService.get(`http://localhost:8765/locations`).pipe(shareReplay(1));
  }

  initSearchForm(): void {
    this.hotelSearchForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      location: ['', Validators.required]
    }, {validators: this.validateDates});
  }

  validateDates(control: FormGroup): { [key: string]: boolean } | null {
    const dateFrom = control.get('dateFrom')?.value;
    const dateTo = control.get('dateTo')?.value;

    if (dateTo < dateFrom) {
      return { 'invalidDateTo': true };
    }

    return null;
  }

  isHotelFormSelected(): boolean {
    return this.selectedForm === 'hotel';
  }

  onSubmit(): void {
    if (this.hotelSearchForm.invalid) {
      return;
    }

    this.searchRequest.setScope({...this.hotelSearchForm.value, vendorType: 1});
    this.router.navigate(['/travelOffers'])
  }

}
