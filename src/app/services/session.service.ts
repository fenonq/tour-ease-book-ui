import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {}

  public getScope(storageKey: string): any {
    const savedRequest = sessionStorage.getItem(storageKey);
    return savedRequest ? JSON.parse(savedRequest) : null;
  }

  public setScope(storageKey: string, scope: any): void {
    sessionStorage.setItem(storageKey, JSON.stringify(scope));
  }

  public removeScope(storageKey: string): void {
    sessionStorage.removeItem(storageKey);
  }
}
