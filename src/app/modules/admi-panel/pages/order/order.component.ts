import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../../shared/models/pedido';
import { Cliente } from '../../../../shared/models/cliente';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DetallePedido } from '../../../../shared/models/detallePedido';
import { Producto } from '../../../../shared/models/producto';
import { DetallePedidoService } from '../../../../shared/services/detalle-pedido.service';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Personal } from '../../../../shared/models/personal';
import { PersonalService } from '../../../../shared/services/personal.service';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit 
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = 'loading';
  pedido: Pedido | undefined;
  cliente: Cliente | undefined;
  personal: Personal | undefined;
  detallesPedido: any[] = [];
  productosMap = new Map<number, Producto>();
  errorMessage: string = ''; 
  listaPersonales: Personal[] = [];
  personalSeleccionado: number | undefined;
  estadoPedido: string = ''; 
  fechaCancelacion: string = '';

  administrador?: Administrador;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private detallePedidoService: DetallePedidoService,
    private productoService: ProductoService,
    private personalService: PersonalService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    const idPedido = this.route.snapshot.paramMap.get('idPedido');
    if (idPedido) {
      this.cargarDatosPedido(Number(idPedido));
      this.cargarDetallesPedido(Number(idPedido));
    } else {
      this.estadoCarga = 'error';
      this.errorMessage = 'ID de pedido no válido';
    }
    this.cargarPersonales();
  }

    
  cargarPersonales(): void {
      this.personalService.list().subscribe(personales => {
        this.listaPersonales = personales;
      }, error => {
        console.error('Error al cargar la lista de personales:', error);
      });
  }

  cargarDatosPedido(idPedido: number): void {
    this.pedidoService.getById(idPedido).pipe(
      catchError(err => {
        console.error(err);
        this.estadoCarga = 'error';
        throw err;
      })
    ).subscribe(pedido => {
      this.pedido = pedido;
      this.clienteService.getById(pedido.idCliente).pipe(
        catchError(err => {
          console.error(err);
          this.estadoCarga = 'error';
          throw err;
        })
      ).subscribe(cliente => {
        this.cliente = cliente;
        this.personalService.getById(pedido.idPersonal).pipe(
          catchError(err => {
            console.error(err);
            this.estadoCarga = 'error';
            throw err;
          })
        ).subscribe(personal => {
          this.personal = personal;
          this.estadoCarga = 'done';
        });
      });
    });
  }

  cargarDetallesPedido(idPedido: number): void {
    this.detallePedidoService.getById(idPedido)
      .pipe(
        switchMap(detalles => {
          if (Array.isArray(detalles)) {
            // Para cada detallePedido, obtenemos el producto asociado
            return forkJoin(detalles.map(detalle =>
              this.productoService.getById(detalle.idProducto)
                .pipe(
                  map(producto => ({
                    ...detalle,
                    producto // Agregamos el producto completo al detalle
                  })),
                  catchError(err => {
                    console.error('Error al cargar producto:', err);
                    // En caso de error al cargar el producto, devolvemos el detalle sin producto
                    return of({
                      ...detalle,
                      producto: { nombre: 'Producto no disponible', imagen01: null }
                    });
                  })
                )
            ));
          } else {
            return of([]); // Si no hay detalles, devolvemos un array vacío
          }
        }),
        catchError(err => {
          console.error('Error al cargar los detalles del pedido:', err);
          this.errorMessage = 'Ocurrió un error al cargar los detalles del pedido y sus productos.';
          this.estadoCarga = 'error';
          return of([]);
        })
      )
      .subscribe(detallesPedido => {
        this.detallesPedido = detallesPedido;
        console.log('Detalles del pedido con productos:', detallesPedido);
      });
  }

   // Guardar el personal seleccionado en el pedido
   guardarPersonalSeleccionado(): void {
    if (this.personalSeleccionado && this.pedido) {
      // Actualizamos el campo idPersonal del pedido existente
      this.pedido.idPersonal = this.personalSeleccionado;

      // Llamamos al servicio para actualizar el pedido completo
      this.pedidoService.update(this.pedido).subscribe(() => {
        console.log('Personal actualizado correctamente');

        // Ahora volvemos a cargar los datos del personal asignado
        this.personalService.getById(this.personalSeleccionado!).subscribe(personal => {
          this.personal = personal; // Actualizamos la variable para reflejar en la vista
          console.log('Personal actualizado en la vista:', this.personal);
        }, error => {
          console.error('Error al cargar el nuevo personal:', error);
        });
      }, error => {
        console.error('Error al actualizar el personal:', error);
      });
    } else {
      console.error('No se ha seleccionado un personal o no se ha cargado el pedido');
    }
  }

  // Método para actualizar el estado del pedido
  actualizarEstado(): void {
    if (this.pedido) {
      this.pedido.estado = this.estadoPedido; // Actualiza el estado del pedido

      this.pedidoService.update(this.pedido).subscribe(() => {
        console.log('Estado del pedido actualizado correctamente');
      }, error => {
        console.error('Error al actualizar el estado del pedido:', error);
      });
    } else {
      console.error('No se ha cargado el pedido');
    }
  }

  // Método para actualizar la fecha de cancelación del pedido
  actualizarFechaCancelacion(): void {
    if (this.pedido) {
      // Asignar fecha de cancelación solo si hay un valor válido
      this.pedido.fechaCancelado = this.fechaCancelacion ? new Date(this.fechaCancelacion) : null; // Usar null si no hay fecha

      this.pedidoService.update(this.pedido).subscribe(() => {
        console.log('Fecha de cancelación del pedido actualizada correctamente');
      }, error => {
        console.error('Error al actualizar la fecha de cancelación del pedido:', error);
      });
    } else {
      console.error('No se ha cargado el pedido');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
