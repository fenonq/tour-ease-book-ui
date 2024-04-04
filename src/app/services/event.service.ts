import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private searchEvent = new Subject<any>();

  constructor() { }

  emitSearchEvent(data: any) {
    this.searchEvent.next(data);
  }

  getSearchEvent(): Observable<any> {
    return this.searchEvent.asObservable();
  }
}
