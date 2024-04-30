import {Component, Input, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {min} from "rxjs";

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent implements OnInit {

  @Input() hotel: any;

  constructor(private router: Router) {
  }

  ngOnInit(): void {

  }
  // todo cut amenities show only 3-5

  getOfferMinPrice(offer: any): number {
    // @ts-ignore
    return Math.min(...offer.rooms.map(room => room.price));
  }

  cutDescription(description: string): string {
    return description.length > 330 ? description.slice(0, 330) + '...' : description;
  }

  getHotelStars(stars: number): Array<number> {
    return Array.from({length: stars}, (_, index) => index);
  }

  getHotelRating(reviews: Array<any>): number {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    return totalRating / reviews.length;
  }

  getHotelWordRating(rating: number): string {
    if (rating >= 4.5) {
      return 'Відмінно';
    }
    if (rating >= 4.0) {
      return 'Чудово';
    }
    if (rating >= 3.5) {
      return 'Добре';
    }
    if (rating >= 3.0) {
      return 'Задовільно';
    }
    if (rating >= 2.0) {
      return 'Посередньо';
    }

    return 'Погано';
  }

  getTravelOfferDetails(id: string) {
    this.router.navigate(['/travelOffers', id]);
  }
}
