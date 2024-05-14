import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {AuthorizationService} from "../../services/authorization.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(public authorizationService: AuthorizationService) {
  }

  logout(): void {
    this.authorizationService.removeJwtToken();
  }

}
