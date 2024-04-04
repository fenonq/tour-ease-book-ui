import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() {
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  setJwtToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  removeJwtToken(): void {
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getBearerToken(): string {
    const token = this.getJwtToken();
    return `Bearer ${token}`;
  }
}
