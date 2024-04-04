import {Component} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {NgIf} from "@angular/common";

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
    public authorizationService: AuthorizationService
  ) {
  }

  logout(): void {
    this.authorizationService.removeJwtToken();
  }

}
