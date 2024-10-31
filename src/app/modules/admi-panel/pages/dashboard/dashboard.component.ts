import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { SumaTotalResponse, TotalPedidos } from '../../../../shared/models/pedido';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit 
{
  pedidosPendientes: number = 0;
  pedidosEntregados: number = 0;
  pedidosEnviados: number = 0;
  pedidosCancelados: number = 0;
  sumaDelTotal: number = 0;
  totalPedidos: number = 0;

  administrador?: Administrador;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthenticationService,
    private router: Router
  ) { }
  
  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.pedidoService.getPedidosPendientes()
      .subscribe(pedidos => this.pedidosPendientes = pedidos.length);

    this.pedidoService.getPedidosEntregados()
      .subscribe(pedidos => this.pedidosEntregados = pedidos.length);

    this.pedidoService.getPedidosEnviados()
      .subscribe(pedidos => this.pedidosEnviados = pedidos.length);

    this.pedidoService.getPedidosCancelados()
      .subscribe(pedidos => this.pedidosCancelados = pedidos.length);

    this.pedidoService.getSumaTotalPedidos()
      .subscribe(
      (response: SumaTotalResponse) => {
        this.sumaDelTotal = response.total;
      },
      error => {
        console.error('Error al obtener el total de pedidos:', error);
      }
    );

    this.pedidoService.getPedidosTotales()
      .subscribe(
      (response: TotalPedidos) => {
        this.totalPedidos = response.total;
      },
      error => {
        console.error('Error al obtener el total de pedidos:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
