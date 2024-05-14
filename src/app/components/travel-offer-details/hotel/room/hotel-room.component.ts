import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {ShoppingCartService} from "../../../../services/shopping-cart.service";
import {SearchRequestService} from "../../../../services/search-request.service";
import {BedType, CartItem, Room} from "../../../../models/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-hotel-room',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TitleCasePipe,
    FormsModule
  ],
  templateUrl: './hotel-room.component.html',
  styleUrl: './hotel-room.component.css'
})
export class HotelRoomComponent implements OnInit {

  @Input() room: Room;
  @Input() offerId: string;

  isAdded: boolean = false;
  numberOfRooms: number = 1;

  constructor(
    public searchRequestService: SearchRequestService,
    private cartService: ShoppingCartService,
  ) {
  }

  ngOnInit(): void {
    this.isAdded = !!this.cartService.getCart().find(item => item.offerId === this.offerId && item.roomId === this.room.roomId);
  }

  getBedTitle(bedType: BedType, bedNumber: number): string {
    switch (bedType) {
      case BedType.DOUBLE_BED:
        return bedNumber === 1 ? 'Двоспальне ліжко' : 'Двоспальні ліжка';
      case BedType.SINGLE_BED:
        return bedNumber === 1 ? 'Односпальне ліжко' : 'Односпальні ліжка';
      default:
        return 'Ліжко';
    }
  }

  addToCart(hotelId: string, roomId: string, numberOfRooms: number): void {
    if (numberOfRooms < 1 || numberOfRooms > this.room.numberOfAvailableRooms) {
      alert("Некоректна кількість кімнат!");
      return;
    }

    const searchRq = this.searchRequestService.getScope();
    const item =
      {
        vendorType: 1,
        offerId: hotelId,
        roomId: roomId,
        numberOfRooms: numberOfRooms,
        dateFrom: searchRq.dateFrom,
        dateTo: searchRq.dateTo
      } as CartItem;
    this.cartService.addItem(item);
    this.isAdded = true;
  }

}
