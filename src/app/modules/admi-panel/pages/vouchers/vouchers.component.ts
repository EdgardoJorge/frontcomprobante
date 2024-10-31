import { Component, OnInit } from '@angular/core';
import { Comprobante } from '../../../../shared/models/comprobante';
import { ComprobanteService } from '../../../../shared/services/comprobante.service';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { Pedido } from '../../../../shared/models/pedido';
import { Cliente } from '../../../../shared/models/cliente';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

interface ComprobanteDetalle {
  comprobante: Comprobante;
  pedido: Pedido | null;
  cliente: Cliente | null;
}

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.css'
})
export class VouchersComponent implements OnInit
{
  
  comprobantes: ComprobanteDetalle[] = [];
  filttroComprobantes: ComprobanteDetalle[] = [];
  isLoading = false;
  tipoComprobanteFiltro = '' as 'Factura' | 'Boleta' | '';
  razonSocialFiltro: string = '';

  p: number = 1;
  administrador?: Administrador;

  constructor(
    private comprobanteService: ComprobanteService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listarComprobantes();
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
  }

  listarComprobantes(): void {
    this.isLoading = true;

    this.comprobanteService.list().pipe(
      switchMap(comprobantes => 
        forkJoin(
          comprobantes.map(comprobante => this.obtenerDetallesComprobante(comprobante))
        )
      ),
      catchError(error => {
        console.error('Error al obtener comprobantes:', error);
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(comprobantesConDetalles => {
        this.comprobantes = comprobantesConDetalles;
        this.filttroComprobantes = this.comprobantes; 
        this.isLoading = false;
    });
  }
  
  private obtenerDetallesComprobante(comprobante: Comprobante): Observable<ComprobanteDetalle> {
    return forkJoin([
      of(comprobante),
      this.pedidoService.getById(comprobante.idPedido).pipe(catchError(() => of(null))),
      this.pedidoService.getById(comprobante.idPedido)
        .pipe(
          switchMap(pedido => pedido ? this.clienteService.getById(pedido.idCliente).pipe(catchError(() => of(null))) : of(null)),
          catchError(() => of(null))
        )
    ]).pipe(
      map(([comprobante, pedido, cliente]) => ({ comprobante, pedido, cliente }))
    );
  }

  filtrarPorTipoComprobante(tipo: 'Factura' | 'Boleta'): void {
    this.tipoComprobanteFiltro = tipo;
    this.actualizarComprobantesFiltrados(); 
  }

  filtrarPorRazonSocial(razonSocial: string): void {
    this.razonSocialFiltro = razonSocial.toLowerCase(); 
    this.actualizarComprobantesFiltrados();
  }

  actualizarComprobantesFiltrados(): void {
    this.filttroComprobantes = this.comprobantes.filter(comprobante =>
      (!this.tipoComprobanteFiltro || comprobante.comprobante.tipoComprobante === this.tipoComprobanteFiltro) &&
      (!this.razonSocialFiltro || comprobante.cliente?.razonSocial.toLowerCase().includes(this.razonSocialFiltro.toLowerCase()))
    );
  }

  restablecerFiltros(): void {
    this.tipoComprobanteFiltro = '';
    this.razonSocialFiltro = '';
    this.filttroComprobantes = this.comprobantes; 
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
