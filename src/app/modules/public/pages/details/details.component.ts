import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../../../shared/models/producto';
import { ProductoService } from '../../../../shared/services/producto.service'; 
import { Marca } from '../../../../shared/models/marca';
import { MarcaService } from '../../../../shared/services/marca.service';
import { Categoria } from '../../../../shared/models/categoria';
import { CategoriaService } from '../../../../shared/services/categoria.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';
  producto!: Producto; 
  marca!: Marca; 
  categoria!: Categoria; 
  carritoIds: string[] = []; 
  productoAnadido: boolean = false; 
  idProducto : number | null = null;
  cantidadInvalida = false;
  productoEnCarrito = false;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private categoriaService:CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargaDatos = 'loading';
    this.carritoIds = this.getCarritoIds(); 

    this.route.params.subscribe(params => {
      const idProducto = params['idProducto']; 
      if (idProducto) {
        this.obtenerProducto(idProducto);
      } else {
        this.cargaDatos = 'error'; 
      }
    });
  }

  // Método para obtener un producto por su ID
  obtenerProducto(idProducto: number): void {
    this.productoService.getById(idProducto).subscribe({
      next: (data: Producto) => {
        this.producto = data; 
        this.cargaDatos = 'done'; 
        this.obtenerMarca(this.producto.idMarca);
        this.obtenerCategoria(this.producto.idCategoria);
      },
      error: () => {
        this.cargaDatos = 'error'; 
      }
    });
  }

  // Método para obtener la marca por su ID
  obtenerMarca(idMarca: number): void {
    this.marcaService.getById(idMarca).subscribe({
      next: (data: Marca) => {
        this.marca = data;
      },
      error: () => {
      }
    });
  }

  // Método para obtener la categoría por su ID
  obtenerCategoria(idCategoria: number): void {
    this.categoriaService.getById(idCategoria).subscribe({
      next: (data: Categoria) => {
        this.categoria = data; 
      },
      error: () => {
      }
    });
  }

  // Método para agregar un producto al carrito
  agregarAlCarrito(): void {
    if (this.producto.idProducto && this.producto.cantidad > 0) {
      const carritoIds = this.getCarritoIds();
      const idStr = this.producto.idProducto.toString();

      if (!carritoIds.includes(idStr)) {
        carritoIds.push(idStr);
        localStorage.setItem('carritoIds', JSON.stringify(carritoIds));
        this.productoAnadido = true;
        // console.log('Producto añadido al carrito:', this.producto.idProducto);
        setTimeout(() => {
          this.productoAnadido = false;
        }, 3000);
      } else {
        this.productoEnCarrito = true;
        setTimeout(() => {
          this.productoEnCarrito = false;
        }, 2000);
      }
    } else {
      this.cantidadInvalida = true;
      setTimeout(() => {
        this.cantidadInvalida = false;
      }, 3000);
    }
  }

  // Método para obtener los IDs del carrito desde Local Storage
  getCarritoIds(): string[] {
    const ids = localStorage.getItem('carritoIds'); 
    return ids ? JSON.parse(ids) : []; 
  }

}


