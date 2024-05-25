import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {HttpService} from "../../services/http.service";
import {from, map, mergeMap, Observable, of, reduce, shareReplay} from "rxjs";
import {AsyncPipe, DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {HotelComponent} from "../travel-offers/hotel/hotel.component";
import {CartItem, Hotel, Room} from "../../models/core";
import {SearchRequestService} from "../../services/search-request.service";
import {Router} from "@angular/router";

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

  cartOffersDetails: Observable<Array<Hotel>>;
  uniqueCartItems: Array<CartItem>;

  constructor(
    public searchRequestService: SearchRequestService,
    public cartService: ShoppingCartService,
    private httpService: HttpService,
    private router: Router,
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

  getCartOffersDetails(): Observable<Array<Hotel>> {
    const offersIds = this.cartService.getCart().map(item => item.offerId).join();
    return this.httpService.get(`http://localhost:8765/cartOffersDetails/${offersIds}`);
  }

  getHotelById(hotelId: string): Observable<Hotel> {
    return this.cartOffersDetails.pipe(
      map(hotels => hotels.find(hotel => hotel.id === hotelId)),
      map(hotel => hotel || ({} as Hotel))
    );
  }

  getRoomsByHotelId(hotelId: string): Observable<Array<Room>> {
    const selectedRoomsIdsByHotelId = this.cartService.getCart()
      .filter(offer => offer.offerId === hotelId)
      .map(offer => offer.roomId);

    return this.cartOffersDetails.pipe(
      map(hotels => hotels.find(hotel => hotel.id === hotelId)?.rooms.filter(room => selectedRoomsIdsByHotelId.includes(room.roomId))),
      map(rooms => rooms || [])
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

  getTotalPrice(): Observable<number> {
    const cartItems = this.cartService.getCart();
    if (cartItems.length === 0) {
      return of(0);
    }

    return from(cartItems).pipe(
      mergeMap(cartItem =>
        this.cartOffersDetails.pipe(
          map(hotels => hotels.find(hotel => hotel.id === cartItem.offerId)),
          map(hotel => {
            const room = hotel ? hotel.rooms.find(r => r.roomId === cartItem.roomId) : null;
            const nights = this.getNumberOfNights(cartItem);
            return room ? room.price * nights * cartItem.numberOfRooms : 0;
          })
        )
      ),
      reduce((acc, curr) => acc + curr, 0)
    );
  }

  removeItem(offerId: string, roomId?: string) {
    this.cartService.removeItem(offerId, roomId)
    this.getUniqueCartItems();
  }

  order(): void {
    this.httpService.post('http://localhost:8765/createOrder', {
      cart: {
        cartItems: this.cartService.getCart()
      }
    }).subscribe({
      next: () => {
        this.searchRequestService.removeScope();
        this.clear();
        this.router.navigate(['/orders']);
      }
    });
  }

  clear(): void {
    this.cartService.clearCart();
    this.getUniqueCartItems();
  }

}
