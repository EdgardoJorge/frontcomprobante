import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../../shared/models/pedido';
import { Cliente } from '../../../../shared/models/cliente';
import { Recojo } from '../../../../shared/models/recojo';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { RecojoService } from '../../../../shared/services/recojo.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

interface PedidoConDetalles {
  pedido: Pedido;
  cliente: Cliente | null; 
  recojo: Recojo | null; 
}

@Component({
  selector: 'app-recojos',
  templateUrl: './recojos.component.html',
  styleUrl: './recojos.component.css'
})
export class RecojosComponent  implements OnInit
{
  pedidosConDetalles: PedidoConDetalles[] = [];
  estadoFiltro: string | null = null;
  isLoading = false;
  razonSocialFiltro: string = '';

  p: number = 1;

  administrador?: Administrador;

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private recojoService: RecojoService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listarPedidos();
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
  }

  listarPedidos(): void {
    this.isLoading = true;

    this.pedidoService.list().pipe(
      switchMap(pedidos =>
        forkJoin(
          pedidos.map(pedido => this.obtenerDetalles(pedido))
        )
      ),
      map(pedidosConDetalles =>
        pedidosConDetalles.filter(pedido => pedido.pedido.tipoPedido === 'Recojo en Tienda')
      ),
      catchError(error => {
        console.error('Error al obtener pedidos de recojos:', error);
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(pedidosConDetalles => {
      this.pedidosConDetalles = pedidosConDetalles;
      this.isLoading = false;
    });
  }

  private obtenerDetalles(pedido: Pedido): Observable<PedidoConDetalles> {
    return forkJoin([
      of(pedido),
      this.clienteService.getById(pedido.idCliente).pipe(catchError(() => of(null))),
      this.recojoService.getById(pedido.idRecojo).pipe(catchError(() => of(null)))
    ]).pipe(
      map(([pedido, cliente, recojo]) => ({pedido, cliente, recojo}))
    );
  }

  // Método para filtrar por estado
  filtrarPorEstado(estado: string): void {
    this.estadoFiltro = estado;
  }

  // Método para restablecer el filtro a todos
  restablecerFiltro(): void {
    this.estadoFiltro = null;
    this.razonSocialFiltro = '';
  }

  //Metodo para filtrar por clliente
  filtrarPorRazonSocial(razonSocial: string): void {
    this.razonSocialFiltro = razonSocial.toLowerCase(); // Convertir a minúsculas para una comparación más precisa
  }
  

  pedidosFiltrados(): PedidoConDetalles[] {
    return this.pedidosConDetalles.filter(pedido => {
      return (
        (!this.estadoFiltro || pedido.pedido.estado === this.estadoFiltro) &&
        pedido.pedido.tipoPedido === 'Recojo en Tienda' &&
        (!this.razonSocialFiltro || (pedido.cliente?.razonSocial ?? '').toLowerCase().includes(this.razonSocialFiltro))
      );
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
