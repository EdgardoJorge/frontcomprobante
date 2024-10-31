import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../../shared/models/pedido';
import { Cliente } from '../../../../shared/models/cliente';
import { Envio } from '../../../../shared/models/envio';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { EnvioService } from '../../../../shared/services/envio.service';
import { Personal } from '../../../../shared/models/personal';
import { PersonalService } from '../../../../shared/services/personal.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Producto } from '../../../../shared/models/producto';
import { DetallePedidoService } from '../../../../shared/services/detalle-pedido.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ProductoService } from '../../../../shared/services/producto.service';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.css'
})
export class ShipmentComponent implements OnInit 
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = 'loading'; 
  pedido: Pedido | undefined;
  cliente: Cliente | undefined;
  envio: Envio | undefined;
  personal: Personal | undefined;
  personalEnvio: Personal | undefined;
  envioForm!: FormGroup;
  listaPersonales: Personal[] = [];
  estadoPedido: string = ''; 

  detallesPedido: any[] = [];
  productosMap = new Map<number, Producto>();
  errorMessage: string = ''; 

  administrador?: Administrador;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private envioService: EnvioService,
    private personalService: PersonalService,
    private detallePedidoService: DetallePedidoService,
    private productoService: ProductoService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    const idEnvio: string | null = this.route.snapshot.paramMap.get('idEnvio');

    if (idEnvio) {
      this.estadoCarga = 'loading';

      this.pedidoService.getPedidoByIdEnvio(Number(idEnvio))
        .subscribe({
          next: (pedido) => {
            this.pedido = pedido;
            this.estadoCarga = 'done';

            this.cargarDatosDePedido(pedido);

            this.cargarDetallesPedido(pedido.idPedido); 
          },
          error: (error) => {
            console.error('Error fetching pedido:', error);
            this.estadoCarga = 'error';
          }
        });
    } else {
      this.estadoCarga = 'error';
      console.error('El idEnvio es nulo');
    };

    this.envioForm = new FormGroup({
      fechaEnvio: new FormControl(null),
      fechaEntrega: new FormControl(null),
      responsableEntrega: new FormControl(null),
      idPersonal: new FormControl(null)
    });

    this.cargarPersonales();
  }

  cargarDatosDePedido(pedido: Pedido) {
    this.clienteService.getById(pedido.idCliente)
      .subscribe({
        next: (cliente) => {
          this.cliente = cliente;
        },
        error: (error) => {
          console.error('Error fetching cliente:', error);
          this.estadoCarga = 'error';
        }
      });

      this.envioService.getById(pedido.idEnvio)
      .subscribe({
        next: (envio) => {
          this.envio = envio;

          this.envioForm.patchValue({
            fechaEnvio: envio.fechaEnvio,
            fechaEntrega: envio.fechaEntrega,
            responsableEntrega: envio.responsableEntrega,
            idPersonal: envio.idPersonal
          });

          if (envio.idPersonal) {
            this.personalService.getById(envio.idPersonal)
              .subscribe({
                next: (personal) => {
                  this.personalEnvio = personal;
                  console.log('Nombre del personal:', personal.nombres);
                },
                error: (error) => {
                  console.error('Error al obtener el personal:', error);
                }
              });
          } else {
            console.log('No hay personal asignado al envío');
          }
        },
      });

      this.personalService.getById(pedido.idPersonal)
        .subscribe({
          next: (personal) => {
            this.personal = personal;
          },
          error: (error) => {
            console.error('Error fetching personal:', error);
            this.estadoCarga = 'error';
          }
        });
    }

  actualizarEnvio() {
    if (this.envioForm.valid) {
      const updatedEnvio: Envio = {
        ...this.envio,
        ...this.envioForm.value
      };

      this.envioService.update(updatedEnvio)
        .subscribe({
          next: () => {
            console.log('Envio actualizado correctamente');
            this.ngOnInit(); 
            
          },
          error: (error) => {
            console.error('Error al actualizar el envío:', error);
          }
        });
    } else {
      console.error('Formulario inválido');
    }
  }

  cargarPersonales(): void {
    this.personalService.list().subscribe(personales => {
      this.listaPersonales = personales;
    }, error => {
      console.error('Error al cargar la lista de personales:', error);
    });
  }

  actualizarEstado(): void {
    if (this.pedido) {
      this.pedido.estado = this.estadoPedido; 

      this.pedidoService.update(this.pedido).subscribe(() => {
        console.log('Estado del pedido actualizado correctamente');
      }, error => {
        console.error('Error al actualizar el estado del pedido:', error);
      });
    } else {
      console.error('No se ha cargado el pedido');
    }
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

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
