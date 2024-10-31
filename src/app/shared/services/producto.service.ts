import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto, ProductoBody } from '../models/producto';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class  ProductoService {

  constructor( private http: HttpClient) { }

  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${environment.backendBaseUrl}/api/store/producto`);
  }

  update(producto: Producto): Observable<Producto> {
    const url = `${environment.backendBaseUrl}/api/store/producto/${producto.idProducto}`;
    return this.http.put<Producto>(url, producto);
  }

  getById(idProducto: number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.backendBaseUrl}/api/store/producto/${idProducto}`);
  }

  create(body: ProductoBody): Observable<Producto> {
    const url = `${environment.backendBaseUrl}/api/store/producto`;
    return this.http.post<Producto>(url, body);
  }

  search(query: string): Observable<any> {
    return this.http.get(`${environment.backendBaseUrl}/api/store/producto/Buscar?Nombre=${query}`);
  }

  
}
