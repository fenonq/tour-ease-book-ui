import {Component, Input, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";

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

  getHotelRating(reviews: Array<any>): string {
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

  getTravelOfferDetails(id: string) {
    this.router.navigate(['/travelOffers', id]);
  }
}
