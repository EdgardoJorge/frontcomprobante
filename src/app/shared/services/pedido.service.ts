import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido, PedidoBody, SumaTotalResponse, TotalPedidos } from '../models/pedido';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(
      `${environment.backendBaseUrl}/api/store/pedido`);
  }
  
  getById(idPedido: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${environment.backendBaseUrl}/api/store/pedido/${idPedido}`);
  }

  update(pedido: Pedido): Observable<Pedido> {
    const url = `${environment.backendBaseUrl}/api/store/pedido/${pedido.idPedido}`;
    return this.http.put<Pedido>(url, pedido);
  }

  getPedidoByIdEnvio(idEnvio: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${environment.backendBaseUrl}/api/store/pedido/pedidoPorIdEnvio/${idEnvio}`);
  }

  getPedidoByIdRecojo(idRecojo: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${environment.backendBaseUrl}/api/store/pedido/pedidoPorIdRecojo/${idRecojo}`);
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${environment.backendBaseUrl}/api/store/pedido/pedidosPendientes`);
  }

  getPedidosEntregados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${environment.backendBaseUrl}/api/store/pedido/pedidosEntregados`);
  }

  getPedidosEnviados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${environment.backendBaseUrl}/api/store/pedido/pedidosEnviados`);
  }

  getPedidosCancelados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${environment.backendBaseUrl}/api/store/pedido/pedidosCancelados`);
  }

  getPedidosTotales(): Observable<TotalPedidos> {
    return this.http.get<TotalPedidos>(`${environment.backendBaseUrl}/api/store/pedido/totalPedidos`);
  }

  getSumaTotalPedidos(): Observable<SumaTotalResponse> {
    return this.http.get<SumaTotalResponse>(`${environment.backendBaseUrl}/api/store/pedido/sumaTotal`);
  }

  buscarPedido(idPedido: number, numeroDocumento: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${environment.backendBaseUrl}/api/store/pedido/pedidosBuscar?idPedido=${idPedido}&numeroDocumento=${numeroDocumento}`);
  }
  create(body: PedidoBody): Observable<Pedido> {
    const url = `${environment.backendBaseUrl}/api/store/pedido`;
    return this.http.post<Pedido>(url, body);
}
}