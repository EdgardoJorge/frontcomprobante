import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private ubigeoUrl = 'assets/ubigeos_peru.json'; 

  constructor(private http: HttpClient) {}

  getUbigeos(): Observable<any> {
    return this.http.get(this.ubigeoUrl);
  }
}
