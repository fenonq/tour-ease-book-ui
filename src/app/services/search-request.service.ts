import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchRequestService {

  private STORAGE_KEY = 'searchRequest';

  constructor() {}

  public getScope(): any {
    const savedRequest = localStorage.getItem(this.STORAGE_KEY);
    return savedRequest ? JSON.parse(savedRequest) : null;
  }

  public setScope(scope: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scope));
  }

  public removeScope(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
