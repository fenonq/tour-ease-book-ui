import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

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
  locations: string[] = ['Location 1', 'Location 2', 'Location 3'];
  selectedForm: string = 'hotel';

  constructor(private formBuilder: FormBuilder) {
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

    console.log('Search parameters:', this.hotelSearchForm.value);
  }

}
