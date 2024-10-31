import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca, MarcaBody } from '../models/marca';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Marca[]> {
    return this.http.get<Marca[]>(
      `${environment.backendBaseUrl}/api/store/marca`);
  }

  update(marca: Marca): Observable<Marca> {
    const url = `${environment.backendBaseUrl}/api/store/marca/${marca.idMarca}`;
    return this.http.put<Marca>(url, marca);
  }

  create(body: MarcaBody): Observable<Marca> {
    const url = `${environment.backendBaseUrl}/api/store/marca`;
    return this.http.post<Marca>(url, body);
  }

  getById(idMarca: number): Observable<Marca> {
    return this.http.get<Marca>(`${environment.backendBaseUrl}/api/store/marca/${idMarca}`);
  }
}
