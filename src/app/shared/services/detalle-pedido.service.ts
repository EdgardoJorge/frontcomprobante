import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetallePedido, DetallePedidoBody } from '../models/detallePedido';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoService {

  constructor(private http: HttpClient) { }

  list(): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(
      `${environment.backendBaseUrl}/api/store/detallePedido`);
  }

  // Método para obtener detalles de pedido por idPedido
  getById(idPedido: number): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(
     `${environment.backendBaseUrl}/api/store/detallePedido/detallePedidos/${idPedido}`);
  }
  create(body: DetallePedidoBody): Observable<DetallePedido> {
    const url = `${environment.backendBaseUrl}/api/store/detallePedido`;
    return this.http.post<DetallePedido>(url, body);
}
}
