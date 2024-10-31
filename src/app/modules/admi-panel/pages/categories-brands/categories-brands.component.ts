import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../../../shared/models/categoria';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { Marca } from '../../../../shared/models/marca';
import { MarcaService } from '../../../../shared/services/marca.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-brands',
  templateUrl: './categories-brands.component.html',
  styleUrl: './categories-brands.component.css'
})
export class CategoriesBrandsComponent implements OnInit {
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = "none";
  categorias: Categoria[] = [];
  marcas: Marca[] = [];

  p: number = 1;

  administrador?: Administrador;

  constructor(
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.listarCategorias();
    this.listarMarcas()
  }

  listarCategorias() {
    this.estadoCarga = 'loading';
    this.categoriaService.list().subscribe({
        next: (data) => {
          this.estadoCarga = 'done';
          this.categorias = data;
        },
        error: () => {
            this.estadoCarga = 'error';
        }
      });
  }

  listarMarcas() {
    this.estadoCarga = 'loading';
    this.marcaService.list().subscribe({
        next: (data) => {
          this.estadoCarga = 'done';
          this.marcas = data;
        },
        error: () => {
            this.estadoCarga = 'error';
        }
      });
  }

  cambiarEstadoCategoria(categoria: Categoria) {
    categoria.estado = !categoria.estado;
    this.categoriaService.update(categoria)
      .subscribe({
        next: () => {
          this.listarCategorias();
        },
        error: (error) => {
          console.error('Error al actualizar la categoría:', error);
          categoria.estado = !categoria.estado; 
        }
      });
  }

  cambiarEstadoMarca(marca: Marca) {
    marca.estado = !marca.estado;
    this.marcaService.update(marca)
      .subscribe({
        next: () => {
          this.listarMarcas();
        },
        error: (error) => {
          console.error('Error al actualizar la categoría:', error);
          marca.estado = !marca.estado; 
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
