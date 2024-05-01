import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {map, Observable, shareReplay} from "rxjs";
import {CartItem} from "../../models/core";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {HttpService} from "../../services/http.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {TravelOfferDetailsComponent} from "../travel-offer-details/travel-offer-details.component";
import $ from "jquery";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    DatePipe,
    TravelOfferDetailsComponent
  ],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit {

  userOrders: Observable<any>;

  constructor(
    private router: Router,
    public cartService: ShoppingCartService,
    private httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
    this.userOrders = this.getUserOrders().pipe(shareReplay(1));
  }

  getUserOrders(): Observable<any> {
    return this.httpService.get(`http://localhost:8765/userOrders`);
  }

  getNumberOfNights(dateFrom: Date, dateTo: Date): number {
    const timeDifference = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }

  openDetails(offerId: string): void {
    this.router.navigate(['/travelOffers', offerId]);
  }

}
