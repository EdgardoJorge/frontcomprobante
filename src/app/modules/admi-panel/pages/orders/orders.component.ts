import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../../shared/models/pedido';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { Cliente } from '../../../../shared/models/cliente';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})

export class OrdersComponent implements OnInit   
 {
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = 'loading';
  pedidos: Pedido[] = [];
  clientesMap: Map<number, Cliente> = new Map();
  estadoFiltro: string | null = null; 
  razonSocialFiltro: string = '';

  p: number = 1;
  administrador?: Administrador;
  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
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
    this.estadoCarga = 'loading';

    this.pedidoService.list().pipe(
      catchError((error) => {
        console.error('Error al obtener pedidos:', error);
        this.estadoCarga = 'error';
        return [];
      })
    ).subscribe(pedidos => {
      this.estadoCarga = 'done';
      this.pedidos = pedidos || [];
      this.obtenerClientesPorPedidos(this.pedidos);
    });
  }

  private obtenerClientesPorPedidos(pedidos: Pedido[]): void {
    const clientObservables = pedidos.map(pedido => 
      this.clienteService.getById(pedido.idCliente).pipe(
        catchError(error => {
          console.error(`Error fetching client details for order ${pedido.idPedido}:`, error);
          return [null]; 
        })
      )
    );

    forkJoin(clientObservables).subscribe(clientes => {
      this.clientesMap = new Map(clientes.filter(Boolean).map(cliente => [cliente!.idCliente, cliente!]));
    });
  }

  // Método para filtrar por estado
  filtrarPorEstado(estado: string): void {
    this.estadoFiltro = estado;
  }

  // Método para restablecer el filtro a todos
  restablecerFiltro(): void {
    this.estadoFiltro = null;
  }

  filtrarPorRazonSocial(razonSocial: string): void {
    this.razonSocialFiltro = razonSocial;
  }

  pedidosFiltrados(): Pedido[] {
    return this.pedidos.filter(pedido => {
      const cliente = this.getById(pedido.idCliente);
      return (!this.estadoFiltro || pedido.estado === this.estadoFiltro) &&
             (!this.razonSocialFiltro || cliente?.razonSocial.toLowerCase().includes(this.razonSocialFiltro.toLowerCase()));
    });
  }
  
  getById(idCliente: number): Cliente | undefined {
    return this.clientesMap.get(idCliente);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
