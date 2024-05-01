import {Component, OnInit} from '@angular/core';
import {map, Observable, shareReplay} from "rxjs";
import {CartItem} from "../../models/core";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {HttpService} from "../../services/http.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit {

  cartOffersDetails: Observable<any>;
  uniqueCartItems: Array<CartItem>;
  userOrders: Observable<any>;
  test: Observable<any>;
  orderedItemsDates: Array<any>;

  constructor(
    public cartService: ShoppingCartService,
    private httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
    this.userOrders = this.getUserOrders().pipe(shareReplay(1));
    this.test = this.mergeSameHotels();

  }

  getUserOrders(): Observable<any> {
    return this.httpService.get(`http://localhost:8765/userOrders`);
  }

  getCartItemByHotelAndRoomId(hotelId: string, roomId: string): CartItem {
    return this.cartService.getCart().find(offer => offer.roomId === roomId && offer.offerId === hotelId) as CartItem;
  }

  getNumberOfNights(dateFrom: Date, dateTo: Date): number {
    const timeDifference = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }

  mergeSameHotels(): Observable<any> {
    return this.userOrders.pipe(
      // Плоский перелік усіх orderItems
      // @ts-ignore
      map(userOrders => userOrders.flatMap(userOrder => userOrder.orderedItems)),
      // Групування orderItems по hotelId
      map(orderItems => {
        const hotelsMap = new Map<string, any>();

        console.log(orderItems)
        // @ts-ignore
        orderItems.forEach(item => {
          let hotel = hotelsMap.get(item.offer.id);
          if (!hotel) {
            hotel = { ...item.offer, rooms: [] };
            hotelsMap.set(item.offer.id, hotel);
          }
          // @ts-ignore
          item.offer.rooms.forEach(room => {
            // @ts-ignore
            if (!hotel.rooms.some(hotelRoom => hotelRoom.roomId === room.roomId)) {
              room = { ...room, dateFrom: item.dateFrom, dateTo: item.dateTo}
              hotel.rooms.push(room);
            }
          });
        });

        console.log(hotelsMap.values())

        return Array.from(hotelsMap.values());
      })
    );
  }


}
