import {Component, OnInit} from '@angular/core';
import {map, Observable, shareReplay} from "rxjs";
import {Order, OrderStatus} from "../../models/core";
import {HttpService} from "../../services/http.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {TravelOfferDetailsComponent} from "../travel-offer-details/travel-offer-details.component";
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

  userOrders: Observable<Array<Order>>;

  constructor(
    private router: Router,
    private httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.userOrders = this.httpService.get(`http://localhost:8765/userOrders`).pipe(
      map(orders => this.sortOrders(orders)),
      shareReplay(1)
    );
  }

  sortOrders(orders: Array<Order>): Array<Order> {
    return orders.sort((a, b) => {
      const dateA = new Date(a.creationDateTime);
      const dateB = new Date(b.creationDateTime);
      return dateB.getTime() - dateA.getTime();
    });
  }

  getNumberOfNights(dateFrom: Date, dateTo: Date): number {
    const timeDifference = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }

  openDetails(offerId: string): void {
    this.router.navigate(['/travelOffers', offerId]);
  }

  getOrderStatus(orderStatus: OrderStatus): string {
    switch (orderStatus) {
      case OrderStatus.BOOKED:
        return 'Заброньовано';
      case OrderStatus.CANCELLED:
        return 'Скаcовано';
      default:
        return 'Статус невідомий';
    }
  }

  cancelOrder(order: Order): void {
    const cancelledItems = order.orderedItems.map(item => ({
      dateFrom: item.dateFrom,
      dateTo: item.dateTo,
      numberOfRooms: item.numberOfRooms,
      hotelId: item.offer.id,
      roomId: item.offer.rooms[0].roomId
    }));

    const cancelOrderRequest = {
      orderId: order.id,
      cancelledItems: cancelledItems
    };

    this.httpService.put('http://localhost:8765/cancelOrder', cancelOrderRequest).subscribe(() => {
      this.loadUserOrders();
    });
  }

}
