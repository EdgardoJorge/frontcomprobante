import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Envio, EnvioBody } from '../models/envio';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnvioService {

  constructor(private http: HttpClient) { }

  list(): Observable<Envio[]> {
    return this.http.get<Envio[]>(
      `${environment.backendBaseUrl}/api/store/envio`);
  }
  
  getById(idEnvio: number): Observable<Envio> {
    return this.http.get<Envio>(`${environment.backendBaseUrl}/api/store/envio/${idEnvio}`);
  }

  update(envio: Envio): Observable<Envio> {
    const url = `${environment.backendBaseUrl}/api/store/envio/${envio.idEnvio}`;
    return this.http.put<Envio>(url, envio);
  }
  create(body: EnvioBody): Observable<Envio> {
    const url = `${environment.backendBaseUrl}/api/store/envio`;
    return this.http.post<Envio>(url, body);
}
}
