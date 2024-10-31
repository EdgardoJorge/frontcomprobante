import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Personal, PersonalBody } from '../models/personal';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private http: HttpClient) { }

  list(): Observable<Personal[]> {
    return this.http.get<Personal[]>(
      `${environment.backendBaseUrl}/api/store/personal`);
  }

  getById(idPersonal: number): Observable<Personal> {
    return this.http.get<Personal>(`${environment.backendBaseUrl}/api/store/personal/${idPersonal}`);
  }

  create(body: PersonalBody): Observable<Personal> {
    const url = `${environment.backendBaseUrl}/api/store/personal`;
    return this.http.post<Personal>(url, body);
  }

  update(personal: Personal): Observable<Personal> {
    const url = `${environment.backendBaseUrl}/api/store/personal/${personal.idPersonal}`;
    return this.http.put<Personal>(url, personal);
  }

  search(query: string): Observable<any> {
    return this.http.get(`${environment.backendBaseUrl}/api/store/producto/Buscar?Nombre=${query}`);
  }

  // getProductoById(id: string): Observable<Producto> {
  //   return this.http.get<Producto>(
  //     `${environment.backendBaseUrl}/api/store/producto/${id}` // Asegúrate de usar el id en la URL
  //   );
  // }  


}
