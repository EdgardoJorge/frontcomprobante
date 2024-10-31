import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../../shared/services/carrito.service';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Producto } from '../../../../shared/models/producto';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit
{
  carritoIds: string[] = []; // Array para almacenar los IDs de los productos en el carrito
  productos: Producto[] = []; // Array para almacenar los productos obtenidos
  cantidades: { [key: string]: number } = {}; // Objeto para almacenar cantidades por ID de producto
  idProducto : number | null = null;

  constructor(
    private carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.carritoIds = this.carritoService.getCarritoIds();
    this.cargarCantidadesDesdeStorage(); // Cargar cantidades desde localStorage
    this.cargarProductos();
  }


  cargarProductos(): void {
    this.productos = [];
    for (const idProducto of this.carritoIds) {
      this.productoService.getById(Number(idProducto)).subscribe({
        next: (producto: Producto) => {
          this.productos.push(producto);
          if (!(idProducto in this.cantidades)) {
            this.cantidades[idProducto] = 1; // Asegura que la cantidad se inicialice correctamente
          }
        },
        error: () => {
          console.error('Error al cargar el producto con ID:', idProducto);
        }
      });
    }
  }

  cargarCantidadesDesdeStorage(): void {
    const cantidadesGuardadas = localStorage.getItem('cantidades');
    if (cantidadesGuardadas) {
      this.cantidades = JSON.parse(cantidadesGuardadas);
    }
  }

  guardarCantidadesEnStorage(): void {
    localStorage.setItem('cantidades', JSON.stringify(this.cantidades));
    this.guardarTotalEnStorage(); // Llama al método para guardar el total
  }

  guardarTotalEnStorage(): void {
    const total = this.calcularTotal();
    localStorage.setItem('totalCarrito', total); // Guarda el total en localStorage
  }

  calcularTotal(): string {
    const total = this.productos.reduce((total, producto) => {
      const cantidad = this.cantidades[producto.idProducto.toString()] || 1;
      return total + (producto.precioOferta || producto.precio) * cantidad;
    }, 0);
    return `${total.toFixed(2)}`; // Formatea a dos decimales
  }

  calcularTotalProductos(): number {
    return Object.values(this.cantidades).reduce((total, cantidad) => total + cantidad, 0);
  }

  eliminarDelCarrito(productoId: string): void {
    this.carritoIds = this.carritoIds.filter(id => id !== productoId);
    delete this.cantidades[productoId]; // Elimina la cantidad al eliminar el producto
    this.carritoService.setCarritoIds(this.carritoIds);
    localStorage.setItem('carritoIds', JSON.stringify(this.carritoIds));
    this.guardarCantidadesEnStorage(); // Guardar cantidades en localStorage
    this.cargarProductos();
  }

  mas(productoId: string) {
    if (this.cantidades[productoId] < 5) { // Limita el valor máximo a 7
      this.cantidades[productoId]++;
      this.guardarCantidadesEnStorage(); // Guardar cantidades en localStorage
    }
  }
  
  menos(productoId: string) {
    if (this.cantidades[productoId] > 1) { // Limita el valor mínimo a 1
      this.cantidades[productoId]--;
      this.guardarCantidadesEnStorage(); // Guardar cantidades en localStorage
    }
  }


}
