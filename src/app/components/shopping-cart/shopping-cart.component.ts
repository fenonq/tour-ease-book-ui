import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {HttpService} from "../../services/http.service";
import {map, Observable, shareReplay} from "rxjs";
import {AsyncPipe, DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {HotelComponent} from "../travel-offers/hotel/hotel.component";
import {CartItem} from "../../models/core";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    AsyncPipe,
    HotelComponent,
    NgForOf,
    NgIf,
    TitleCasePipe,
    DatePipe
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {

  cartOffersDetails: Observable<any>;
  uniqueCartItems: Array<CartItem>;

  constructor(
    public cartService: ShoppingCartService,
    private httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
    this.getUniqueCartItems();
    this.cartOffersDetails = this.getCartOffersDetails().pipe(shareReplay(1));
  }

  getUniqueCartItems(): void {
    const cartItems = this.cartService.getCart();
    const seen = new Map();

    this.uniqueCartItems = cartItems.filter(item => {
      return !seen.has(item.offerId) && seen.set(item.offerId, true);
    });
  }

  getCartOffersDetails(): Observable<any> {
    const offersIds = this.cartService.getCart().map(item => item.offerId).join();
    return this.httpService.get(`http://localhost:8765/cartOffersDetails/${offersIds}`);
  }

  getHotelById(hotelId: string): Observable<any> {
    return this.cartOffersDetails.pipe(
      // @ts-ignore
      map(hotels => hotels.find(hotel => hotel.id === hotelId))
    );
  }

  getRoomsByHotelId(hotelId: string): Observable<any> {
    const selectedRoomsIdsByHotelId = this.cartService.getCart()
      .filter(offer => offer.offerId === hotelId)
      .map(offer => offer.roomId);

    return this.cartOffersDetails.pipe(
      // @ts-ignore
      map(hotels => hotels.find(hotel => hotel.id === hotelId)?.rooms.filter(room => selectedRoomsIdsByHotelId.includes(room.roomId)))
    );
  }

  getCartItemByHotelAndRoomId(hotelId: string, roomId: string): CartItem {
    return this.cartService.getCart().find(offer => offer.roomId === roomId && offer.offerId === hotelId) as CartItem;
  }

  getNumberOfNights(cartItem: CartItem): number {
    const dateFrom = new Date(cartItem.dateFrom);
    const dateTo = new Date(cartItem.dateTo);
    const timeDifference = dateTo.getTime() - dateFrom.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }

  removeItem(offerId: string, roomId?: string) {
    this.cartService.removeItem(offerId, roomId)
    this.getUniqueCartItems();
  }

  order(): void {
    this.cartService.clearCart();
    this.getUniqueCartItems();
  }

}
