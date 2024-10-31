
import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../../shared/models/pedido';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { Cliente } from '../../../../shared/models/cliente';
import { Producto } from '../../../../shared/models/producto';
import { DetallePedidoService } from '../../../../shared/services/detalle-pedido.service';
import { ProductoService } from '../../../../shared/services/producto.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Envio } from '../../../../shared/models/envio';
import { EnvioService } from '../../../../shared/services/envio.service';
import { Recojo } from '../../../../shared/models/recojo';
import { RecojoService } from '../../../../shared/services/recojo.service';
@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.css'
})
export class ConsultationComponent implements OnInit
{
  cargadatospedido: 'none' | 'loading' | 'done' | 'error' = 'none';
  pedido: Pedido | undefined;
  idPedido: number = 0;
  numeroDocumento: string = '';
  errorMessage: string = ''; 
  cliente: Cliente | undefined;
  envio: Envio | undefined;
  recojo: Recojo | undefined;
  productosMap = new Map<number, Producto>();
  detallesPedido: any[] = [];

  constructor(
    private pedidosService: PedidoService,
    private detallePedidoService: DetallePedidoService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private envioService: EnvioService,
    private recojoService: RecojoService
  ) {}

  ngOnInit(): void {
  
  }

  buscarPedido() {
    this.cargadatospedido = 'loading';
    this.pedidosService.buscarPedido(this.idPedido, this.numeroDocumento)
      .subscribe(
        (pedido) => {
          this.pedido = pedido;
          this.cargadatospedido = 'done';
          this.cargarPedido();
          this.cargarDetallesPedido();
        },
        (error) => {
          console.error('Error al buscar el pedido:', error);
          this.cargadatospedido = 'error';
        }
      );
  }

  cargarPedido(): void {
    this.pedidosService.getById(this.idPedido)
      .pipe(
        switchMap(pedidoCompleto => {
          this.pedido = pedidoCompleto; 
          this.cargadatospedido = 'loading';

          const clienteRequest = this.pedido.idCliente 
            ? this.clienteService.getById(this.pedido.idCliente)
                .pipe(
                  map(cliente => {
                    this.cliente = cliente;
                    return pedidoCompleto; 
                  }),
                  catchError(err => {
                    console.error('Error al cargar el cliente:', err);
                    this.errorMessage = 'Error al cargar los datos del cliente.';
                    return of(pedidoCompleto); 
                  })
                )
            : of(pedidoCompleto); 

          const recojoRequest = this.pedido.idRecojo 
            ? this.recojoService.getById(this.pedido.idRecojo)
                .pipe(
                  map(recojo => {
                    this.recojo = recojo; 
                  }),
                  catchError(err => {
                    console.error('Error al cargar el recojo:', err);
                    this.errorMessage = 'Error al cargar los datos de recojo.';
                    return of(null);
                  })
                )
            : of(null); 

          const envioRequest = this.pedido.idEnvio 
            ? this.envioService.getById(this.pedido.idEnvio)
                .pipe(
                  map(envio => {
                    this.envio = envio; 
                  }),
                  catchError(err => {
                    console.error('Error al cargar el envío:', err);
                    this.errorMessage = 'Error al cargar los datos de envío.';
                    return of(null); 
                  })
                )
            : of(null); 
          return forkJoin([clienteRequest, recojoRequest, envioRequest]);
        })
      )
      .subscribe(
        () => {
          this.cargadatospedido = 'done';
        },
        (error) => {
          console.error('Error al cargar la información completa del pedido:', error);
        }
      );
  }

  cargarDetallesPedido(): void {
    this.cargadatospedido = 'loading';
    this.detallePedidoService.getById(this.idPedido)
      .pipe(
        switchMap(detalles => {
          if (Array.isArray(detalles)) {
            return forkJoin(detalles.map(detalle =>
              this.productoService.getById(detalle.idProducto)
                .pipe(
                  map(producto => ({
                    ...detalle,
                    producto 
                  })),
                  catchError(err => {
                    console.error('Error al cargar producto:', err);
                    return of({
                      ...detalle,
                      producto: { nombre: 'Producto no disponible', imagen01: null }
                    });
                  })
                )
            ));
          } else {
            return of([]); 
          }
        }),
        catchError(err => {
          console.error('Error al cargar los detalles del pedido:', err);
          this.errorMessage = 'Ocurrió un error al cargar los detalles del pedido y sus productos.';
          this.cargadatospedido = 'error';
          return of([]);
        })
      )
      .subscribe(detallesPedido => {
        this.detallesPedido = detallesPedido;
        this.cargadatospedido = 'done';
      });
  }
}
