import {Injectable} from '@angular/core';
import {CartItem} from "../models/core";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private STORAGE_KEY = 'shoppingCart';

  constructor() {
  }

  public getCart(): Array<CartItem> {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  }

  public addItem(item: CartItem): void {
    const cart = this.getCart();
    cart.push(item);
    this.saveCart(cart);
  }

  // Видалення товару з кошика
  public removeItem(itemId: string, roomId?: string): void {
    let cart = this.getCart();
    cart = cart.filter(item => item.offerId !== itemId || (roomId && item.roomId !== roomId));
    this.saveCart(cart);
  }

  // // Оновлення кількості товару
  // public updateItemQuantity(itemId: number, quantity: number): void {
  //   const cart = this.getCart();
  //   const item = cart.find(item => item.id === itemId);
  //   if (item) {
  //     item.quantity = quantity; // Оновлюємо кількість
  //     this.saveCart(cart);
  //   }
  // }

  // Очищення кошика
  public clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Зберігання кошика в локальному сховищі
  private saveCart(cart: Array<CartItem>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }
}
