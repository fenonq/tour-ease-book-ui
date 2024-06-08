import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from "../../services/http.service";
import { AsyncPipe, NgForOf } from "@angular/common";
import { BedType, Location } from "../../models/core";
import { Observable, shareReplay } from "rxjs";

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.css'
})
export class AddHotelComponent implements OnInit {
  hotelForm: FormGroup;
  locations: Observable<Array<Location>>;
  bedTypes: Array<BedType> = Object.values(BedType);

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.getLocations();

    this.hotelForm = this.fb.group({
      vendorType: ['HOTEL', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
      stars: [5, Validators.required],
      amenities: this.fb.array([]),
      mediaList: this.fb.array([]),
      rooms: this.fb.array([]),
      locationId: ['', Validators.required]
    });
  }

  get amenities(): FormArray {
    return this.hotelForm.get('amenities') as FormArray;
  }

  get mediaList(): FormArray {
    return this.hotelForm.get('mediaList') as FormArray;
  }

  get rooms(): FormArray {
    return this.hotelForm.get('rooms') as FormArray;
  }

  getBeds(index: number): FormArray {
    return this.rooms.controls[index].get('beds') as FormArray;
  }

  addAmenity() {
    this.amenities.push(this.fb.control(''));
  }

  removeAmenity(index: number) {
    this.amenities.removeAt(index);
  }

  addMedia() {
    this.mediaList.push(this.fb.group({
      type: ['IMG', Validators.required],
      source: ['', Validators.required]
    }));
  }

  removeMedia(index: number) {
    this.mediaList.removeAt(index);
  }

  addRoom() {
    this.rooms.push(this.fb.group({
      roomId: ['', Validators.required],
      roomType: ['', Validators.required],
      capacity: [0, Validators.required],
      numberOfRooms: [0, Validators.required],
      price: [0, Validators.required],
      beds: this.fb.array([])
    }));
  }

  removeRoom(index: number) {
    this.rooms.removeAt(index);
  }

  addBed(roomIndex: number) {
    const room = this.rooms.at(roomIndex) as FormGroup;
    const beds = room.get('beds') as FormArray;
    beds.push(this.fb.group({
      type: ['', Validators.required],
      number: [0, Validators.required]
    }));
  }

  removeBed(roomIndex: number, bedIndex: number) {
    const room = this.rooms.at(roomIndex) as FormGroup;
    const beds = room.get('beds') as FormArray;
    beds.removeAt(bedIndex);
  }

  onSubmit() {
    console.log(this.hotelForm.valid);
    this.httpService.post('http://localhost:8765/createHotel', this.hotelForm.value).subscribe({
      next: (response) => {
        console.log('Hotel added successfully!', response);
      },
      error: (err) => {
        console.error('Error adding hotel!', err);
      }
    });
  }

  getLocations(): void {
    this.locations = this.httpService.get(`http://localhost:8765/locations`).pipe(shareReplay(1));
  }

  getBedTitle(bedType: BedType): string {
    switch (bedType) {
      case BedType.DOUBLE_BED:
        return 'Двоспальне ліжко';
      case BedType.SINGLE_BED:
        return 'Односпальне ліжко';
      case BedType.KING_BED:
        return 'Велике двоспальне ліжко';
      default:
        return 'Ліжко';
    }
  }
}
