import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {Hotel, Review} from "../../../models/core";

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent implements OnInit {

  @Input() hotel: Hotel;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }
  // todo cut amenities show only 3-5

  getOfferMinPrice(offer: Hotel): number {
    return Math.min(...offer.rooms.map(room => room.price));
  }

  cutDescription(description: string): string {
    return description.length > 330 ? description.slice(0, 330) + '...' : description;
  }

  getHotelRating(reviews: Array<Review>): string {
    if (reviews.length === 0) {
      return '0';
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    return (totalRating / reviews.length).toFixed(2);
  }

  getHotelWordRating(rating: string): string {
    const parsedRating= parseFloat(rating);
    if (parsedRating >= 4.5) {
      return 'Відмінно';
    }
    if (parsedRating >= 4.0) {
      return 'Чудово';
    }
    if (parsedRating >= 3.5) {
      return 'Добре';
    }
    if (parsedRating >= 3.0) {
      return 'Задовільно';
    }
    if (parsedRating >= 2.0) {
      return 'Посередньо';
    }
    if (parsedRating >= 1.0) {
      return 'Погано';
    }

    return '';
  }

  getTravelOfferDetails(id: string): void {
    this.router.navigate(['/travelOffers', id]);
  }
}
