import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../../shared/services/carrito.service';
import { Producto } from '../../../../shared/models/producto';
import { ProductoService } from '../../../../shared/services/producto.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';
  carritoIds: string[] = [];
  productos: Producto[] = [];
  cantidades: { [key: string]: number } = {};
  total: number = 0;
  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}
  ngOnInit(): void {
    this.carritoIds = this.carritoService.getCarritoIds();
    this.cargarCantidadesDesdeStorage();
    this.cargarProductos();
  }
  cargarCantidadesDesdeStorage(): void {
    const cantidadesGuardadas = localStorage.getItem('cantidades');
    if (cantidadesGuardadas) {
      this.cantidades = JSON.parse(cantidadesGuardadas);
    }
  }
  cargarProductos(): void {
    this.cargaDatos = 'loading';
    this.productos = [];
    const productRequests = this.carritoIds.map(id => 
      this.productoService.getById(Number(id)).toPromise()
    );
    Promise.all(productRequests)
      .then(productos => {
        // Filtra los productos para eliminar undefined
        this.productos = productos.filter((producto): producto is Producto => producto !== undefined);
        this.calcularTotal();
        this.cargaDatos = 'done';
      })
      .catch(() => {
        console.error('Error al cargar los productos.');
        this.cargaDatos = 'error';
      });
  }
  calcularTotalProductos(): number {
    return Object.values(this.cantidades).reduce((total, cantidad) => total + cantidad, 0);
}
  calcularTotal(): void {
    this.total = this.productos.reduce((total, producto) => {
      const cantidad = this.cantidades[producto.idProducto.toString()] || 1; // Se asegura de que la cantidad sea al menos 1
      return total + (producto.precioOferta || producto.precio) * cantidad;
    }, 0);
  }
}