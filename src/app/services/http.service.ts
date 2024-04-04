import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {AuthorizationService} from "./authorization.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private authorizationService: AuthorizationService) { }

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
    const headers = new HttpHeaders();

    if (!url.includes('signIn') || !url.includes('signUp')) {
      const bearerToken = this.authorizationService.getBearerToken();
      headers.set('Authorization', bearerToken);
    }

    return this.http.post(url, data, { headers })
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
