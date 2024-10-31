import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recojo, RecojoBody } from '../models/recojo';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RecojoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Recojo[]> {
    return this.http.get<Recojo[]>(
      `${environment.backendBaseUrl}/api/store/recojo`);
  }
  
  getById(idRecojo: number): Observable<Recojo> {
    return this.http.get<Recojo>(`${environment.backendBaseUrl}/api/store/recojo/${idRecojo}`);
  }

  update(recojo: Recojo): Observable<Recojo> {
    const url = `${environment.backendBaseUrl}/api/store/recojo/${recojo.idRecojo}`;
    return this.http.put<Recojo>(url, recojo);
  }
  create(body: RecojoBody): Observable<Recojo> {
    const url = `${environment.backendBaseUrl}/api/store/recojo`;
    return this.http.post<Recojo>(url, body);
}
}
