import { Routes } from '@angular/router';
import {RegistrationComponent} from "./components/registration/registration.component";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {TripFlowComponent} from "./components/trip-flow/trip-flow.component";
import {TravelOffersComponent} from "./components/travel-offers/travel-offers.component";
import {TravelOfferDetailsComponent} from "./components/travel-offer-details/travel-offer-details.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'flow', component: TripFlowComponent },
  { path: 'travelOffers', component: TravelOffersComponent },
  { path: 'travelOffers/:id', component: TravelOfferDetailsComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
];
