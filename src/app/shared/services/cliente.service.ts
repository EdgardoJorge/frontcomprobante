import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteBody } from '../models/cliente';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(
      `${environment.backendBaseUrl}/api/store/cliente`);
  }

  getById(idCliente: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${environment.backendBaseUrl}/api/store/cliente/${idCliente}`);
  }
  create(body: ClienteBody): Observable<Cliente> {
    const url = `${environment.backendBaseUrl}/api/store/cliente`;
    return this.http.post<Cliente>(url, body);
}
}
