import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DniService {
  private apiUrl = 'https://dniruc.apisperu.com/api/v1/dni';
  private token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhY2VibzMxMzJAYWxlaXRhci5jb20ifQ.rlrd5lRAZ4fSoP2gcbv7Gq6r7tPaaqiS9WHkIM-zgbA'; // Tu token

  constructor(private http: HttpClient) {}

  getDniData(dni: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(`${this.apiUrl}/${dni}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al obtener datos del DNI:', error);
    return throwError('Error al obtener datos del DNI. Por favor, inténtelo de nuevo más tarde.');
  }
}
