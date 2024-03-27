import { Routes } from '@angular/router';
import {RegistrationComponent} from "./components/registration/registration.component";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {TripFlowComponent} from "./components/trip-flow/trip-flow.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'flow', component: TripFlowComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
];
