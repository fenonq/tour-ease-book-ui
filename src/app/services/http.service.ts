import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {AuthorizationService} from "./authorization.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private authorizationService: AuthorizationService
  ) {
  }

  // Метод для виконання GET-запиту
  get(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorizationService.getBearerToken()
    });

    return this.http.get(url, {headers})
      .pipe(
        catchError(error => {
          throw 'Помилка при виконанні GET-запиту: ' + error;
        })
      );
  }

  // Метод для виконання POST-запиту
  post(url: string, data: any): Observable<any> {
    const isAuthRoute = url.includes('signIn') || url.includes('signUp');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': isAuthRoute ? '' : this.authorizationService.getBearerToken()
    });

    return this.http.post(url, data, {headers})
      .pipe(
        catchError(error => {
          throw 'Помилка при виконанні POST-запиту: ' + error;
        })
      );
  }

  // Метод для виконання PUT-запиту
  put(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorizationService.getBearerToken()
    });

    return this.http.put(url, data, { headers })
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
