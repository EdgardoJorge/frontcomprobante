import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Producto } from '../../../../shared/models/producto';
import { Categoria } from '../../../../shared/models/categoria';
import { Marca } from '../../../../shared/models/marca';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { MarcaService } from '../../../../shared/services/marca.service';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = "none";
  estadoCreacion: 'none' | 'loading' | 'done' | 'error' = "none";
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = []
  productosFiltrados: Producto[] = [];
  filtroEstado: 'todos' | 'activos' | 'desactivados' = 'todos';

  searchTerm: string = '';

  precioMinimo: number = 0;
  precioMaximo: number = 10000.00;

  p: number = 1;

  administrador?: Administrador;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private authService: AuthenticationService,
    private router: Router
  ){}

  categoriaMap: Map<number, string> = new Map();
  marcaMap: Map<number, string> = new Map();

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.listarTodos();

    this.categoriaService.list().subscribe(categorias => {
      this.categorias = categorias;
      categorias.forEach(categoria => {
        this.categoriaMap.set(categoria.idCategoria, categoria.categoriaNombre);
      });
    });

    this.marcaService.list().subscribe(marcas => {
      this.marcas = this.marcas;
      marcas.forEach(marca => {
        this.marcaMap.set(marca.idMarca, marca.marcaNombre);
      });
    });
  }

  getNombreCategoria(idCategoria: number): string {
    return this.categoriaMap.get(idCategoria) || 'Categoría no encontrada';
  }

  getNombreMarca(idMarca: number): string {
    return this.marcaMap.get(idMarca) || 'Marca no encontrada';
  }

  listarTodos() {
    this.estadoCarga = 'loading';
    this.productoService.list().subscribe({
        next: (data) => {
          this.estadoCarga = 'done';
          this.productos = data;
          this.filtrarProductos();
        },
        error: () => {
            this.estadoCarga = 'error';
        }
      });
  }

  onActivoClick() {
    this.filtroEstado = 'activos';
    this.filtrarProductos();
  }

  onDesactivadoClick() {
    this.filtroEstado = 'desactivados';
    this.filtrarProductos();
  }

  onCancelarClick() {
    this.filtroEstado = 'todos'; 
    this.filtrarProductos(); 
  }
  filtrarProductos() {
    const searchTermLower = this.searchTerm.toLowerCase();
    const estado = this.filtroEstado;
    
  
    this.productosFiltrados = this.productos.filter(producto => {
      // Condición para filtrar por estado
      const estadoCondicion = estado === 'todos' || producto.estado === (estado === 'activos');
  
      // Condición para filtrar por palabra clave (comenzando desde el principio)
      const busquedaCondicion = searchTermLower ? producto.productoNombre.toLowerCase().startsWith(searchTermLower) : true;

      
      const precioEnRango = producto.precio >= this.precioMinimo && producto.precio <= this.precioMaximo;

  
      return estadoCondicion && busquedaCondicion && precioEnRango;
    });
  
    // Agregar un mensaje de depuración para verificar los resultados
    console.log('Productos filtrados:', this.productosFiltrados);
    console.log('Término de búsqueda:', searchTermLower);
  }

  toggleEstado(producto: Producto) {
    producto.estado = !producto.estado; 
    this.productoService.update(producto)
      .subscribe(
        productoActualizado => {
          this.filtrarProductos();
          console.log('Producto actualizado:', productoActualizado);
        },
        error => {
          console.error('Error al actualizar el producto:', error);
          producto.estado = !producto.estado;
        }
    );
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.filtrarProductos();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}