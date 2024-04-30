import {Component} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {NgIf} from "@angular/common";
import {ShoppingCartService} from "../../services/shopping-cart.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    public authorizationService: AuthorizationService,
    public cartService: ShoppingCartService
  ) {
  }

  logout(): void {
    this.authorizationService.removeJwtToken();
  }

}
