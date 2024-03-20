import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // Метод для виконання GET-запиту
  get(url: string): Observable<any> {
    return this.http.get(url)
      .pipe(
        catchError(error => {
          throw 'Помилка при виконанні GET-запиту: ' + error;
        })
      );
  }

  // Метод для виконання POST-запиту
  post(url: string, data: any): Observable<any> {
    return this.http.post(url, data)
      .pipe(
        catchError(error => {
          throw 'Помилка при виконанні POST-запиту: ' + error;
        })
      );
  }

  // Метод для виконання PUT-запиту
  put(url: string, data: any): Observable<any> {
    return this.http.put(url, data)
      .pipe(
        catchError(error => {
          throw 'Помилка при виконанні PUT-запиту: ' + error;
        })
      );
  }

  // Метод для виконання DELETE-запиту
  delete(url: string): Observable<any> {
    return this.http.delete(url)
      .pipe(
        catchError(error => {
          throw 'Помилка при виконанні DELETE-запиту: ' + error;
        })
      );
  }
}
