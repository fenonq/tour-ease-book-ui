export enum BedType {
  DOUBLE_BED = 'DOUBLE_BED',
  SINGLE_BED = 'SINGLE_BED'
}

export enum OrderStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED'
}

export enum VendorType {
  HOTEL = 'HOTEL'
}

export enum MediaType {
  IMG = 'IMG'
}

export interface Order {
  id: string;
  status: OrderStatus;
  userId: string;
  totalPrice: number;
  orderedItems: Array<OrderedItem>;
  creationDateTime: Date;
}

interface OrderedItem {
  dateFrom: Date;
  dateTo: Date;
  numberOfRooms: number;
  offer: Hotel;
}

export interface Hotel {
  id: string;
  vendorType: VendorType;
  name: string;
  locationId: string;
  location: Location;
  address: string;
  description: string;
  stars: number;
  amenities: Array<string>;
  mediaList: Array<Media>
  rooms: Array<Room>;
  reviews: Array<Review> | [];
}

export interface Location {
  id: string;
  city: string;
  country: string;
}

export interface Media {
  type: MediaType;
  source: string;
}

export interface Room {
  roomId: string;
  roomType: string;
  capacity: number;
  numberOfRooms: number;
  numberOfAvailableRooms: number;
  price: number;
  beds: Array<Bed>;
}

export interface Bed {
  type: BedType;
  number: number;
}

export interface Review {
  username: string;
  rating: number;
  comment: string;
}

export interface CartItem {
  offerId: string;
  roomId: string;
  numberOfRooms: number;
  vendorType: number;
  dateFrom: Date;
  dateTo: Date;
}

export interface GetOffersRequest {
  vendorType: number;
  location: number;
  dateFrom: Date;
  dateTo: Date;
}
