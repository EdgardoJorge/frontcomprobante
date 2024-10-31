import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Administrador, AdministradorBody } from '../models/administrador';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  constructor( private http: HttpClient) { }

  list(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(
      `${environment.backendBaseUrl}/api/store/administrador`);
  }

  update(administrador: Administrador): Observable<Administrador> {
    const url = `${environment.backendBaseUrl}/api/store/administrador/${administrador.idAdministrador}`;
    return this.http.put<Administrador>(url, administrador);
  }

  create(body: AdministradorBody): Observable<Administrador> {
    const url = `${environment.backendBaseUrl}/api/store/administrador`;
    return this.http.post<Administrador>(url, body);
  }

  getById(idAdministrador: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${environment.backendBaseUrl}/api/store/administrador/${idAdministrador}`);
  }
}
