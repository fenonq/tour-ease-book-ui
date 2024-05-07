import {Component, OnInit} from '@angular/core';
import {SearchRequestService} from "../../services/search-request.service";
import {HttpService} from "../../services/http.service";
import {map, mergeMap, Observable, reduce, shareReplay, startWith, switchMap} from "rxjs";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {HotelComponent} from "./hotel/hotel.component";
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
  filteredOffers: Observable<any>;
  searchForm: FormGroup;
  filterForm: FormGroup;
  locations: string[] = ['Location 1', 'Location 2', '2'];
  isExpanded = false;
  amenities: Observable<Array<string>>;

  constructor(
    private formBuilder: FormBuilder,
    private searchRequest: SearchRequestService,
    private httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadOffers();
    this.initializeFilter();
  }

  initSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      location: ['', Validators.required]
    });

    const currentCriteria = this.searchRequest.getScope();
    if (currentCriteria) {
      this.searchForm.patchValue(currentCriteria);
    }
  }

  loadOffers(): void {
    const request = this.searchRequest.getScope();
    this.travelOffers = this.httpService.get(`http://localhost:8765/offers?locationId=${request.location}&dateFrom=${request.dateFrom}&dateTo=${request.dateTo}`).pipe(shareReplay(1));
  }

  initializeFilter(): void {
    this.initializeFilterForm()
    this.collectAmenities();
    this.setupFilteredOffers();
  }

  initializeFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      star5: false,
      star4: false,
      star3: false,
      star2: false,
      star1: false
    });
  }

  collectAmenities(): void {
    this.amenities = this.travelOffers.pipe(
      // @ts-ignore
      mergeMap(offers => offers.map(offer => offer.amenities)), // Отримуємо масив масивів зручностей
      // @ts-ignore
      reduce((acc, amenities) => acc.concat(amenities), []), // Згортаємо всі масиви зручностей в один масив
      map(amenities => Array.from(new Set(amenities))) // Видаляємо дублікати, формуючи Set і перетворюючи його назад в масив
    );

    this.amenities.subscribe(amenities => {
      amenities.forEach(amenity => {
        this.filterForm.addControl(amenity, this.formBuilder.control(false));
      });
    });
  }

  setupFilteredOffers(): void {
    this.filteredOffers = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      switchMap(values => this.filterOffers(values))
    );
  }

  filterOffers(values: any): Observable<any> {
    return this.travelOffers.pipe(
      // @ts-ignore
      map(offers => offers.filter(offer => {
        const selectedAmenities = Object.keys(values).filter(key => key.startsWith('star') ? false : values[key]);
        const selectedStars = Object.keys(values).filter(key => key.startsWith('star') && values[key]).map(key => +key.replace('star', ''));
        return selectedAmenities.every(amenity => offer.amenities.includes(amenity)) &&
          (selectedStars.length ? selectedStars.includes(offer.stars) : true);
      }))
    );
  }

  cutAmenities(amenities: Array<string> | undefined): Array<string> {
    return amenities?.slice(0, 3) || [];
  }

  toggleAmenities(): void {
    this.isExpanded = !this.isExpanded;
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.searchRequest.setScope({...this.searchForm.value, vendorType: 1});
      this.loadOffers();
      this.initializeFilter();
    }
  }

}
