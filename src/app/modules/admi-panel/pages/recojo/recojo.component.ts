import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../../shared/models/pedido';
import { Cliente } from '../../../../shared/models/cliente';
import { Recojo } from '../../../../shared/models/recojo';
import { Personal } from '../../../../shared/models/personal';
import { FormControl, FormGroup } from '@angular/forms';
import { Producto } from '../../../../shared/models/producto';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { RecojoService } from '../../../../shared/services/recojo.service';
import { PersonalService } from '../../../../shared/services/personal.service';
import { DetallePedidoService } from '../../../../shared/services/detalle-pedido.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ProductoService } from '../../../../shared/services/producto.service';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recojo',
  templateUrl: './recojo.component.html',
  styleUrl: './recojo.component.css'
})
export class RecojoComponent implements OnInit
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = 'loading'; 
  pedido: Pedido | undefined;
  cliente: Cliente | undefined;  
  recojo: Recojo | undefined;
  personal: Personal | undefined;
  recojoForm!: FormGroup;
  estadoPedido: string = ''; 

  detallesPedido: any[] = [];
  productosMap = new Map<number, Producto>();
  errorMessage: string = ''; 

  
  administrador?: Administrador;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private recojoService: RecojoService,
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

    const idRecojo: string | null = this.route.snapshot.paramMap.get('idRecojo');

    if (idRecojo) {
      this.estadoCarga = 'loading';

      this.pedidoService.getPedidoByIdRecojo(Number(idRecojo))
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
      console.error('El idRecojo es nulo');
    };

    this.recojoForm = new FormGroup({
      fechaListo: new FormControl(null),
      fechaEntrega: new FormControl(null),
      responsableDeRecojo: new FormControl(null),
    });
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

      this.recojoService.getById(pedido.idRecojo)
      .subscribe({
        next: (recojo) => {
          this.recojo = recojo;

          this.recojoForm.patchValue({
            fechaListo: recojo.fechaListo,
            fechaEntrega: recojo.fechaEntrega,
            responsableDeRecojo: recojo.responsableDeRecojo
          });
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

    actualizarRecojo() {
      if (this.recojoForm.valid) {
        const updatedRecojo: Recojo = {
          ...this.recojo,
          ...this.recojoForm.value
        };
  
        this.recojoService.update(updatedRecojo)
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
