import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria, CategoriaBody } from '../models/categoria';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      `${environment.backendBaseUrl}/api/store/categoria`);
  }

  update(categoria: Categoria): Observable<Categoria> {
    const url = `${environment.backendBaseUrl}/api/store/categoria/${categoria.idCategoria}`;
    return this.http.put<Categoria>(url, categoria);
  }

  create(body: CategoriaBody): Observable<Categoria> {
    const url = `${environment.backendBaseUrl}/api/store/categoria`;
    return this.http.post<Categoria>(url, body);
  }

  getById(idCategoria: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${environment.backendBaseUrl}/api/store/categoria/${idCategoria}`);
  }

  // getCategoriaById(id: string): Observable<Categoria> {
  //   return this.http.get<Categoria>(`${environment.backendBaseUrl}/api/store/categoria/${id}` // Asegúrate de usar el id en la URL
  //   );
  // }

}



