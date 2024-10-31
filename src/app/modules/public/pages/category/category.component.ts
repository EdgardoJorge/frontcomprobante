import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../../../shared/models/producto';
import { Marca } from '../../../../shared/models/marca';
import { ProductoService } from '../../../../shared/services/producto.service';
import { MarcaService } from '../../../../shared/services/marca.service';
import { Categoria } from '../../../../shared/models/categoria';
import { CategoriaService } from '../../../../shared/services/categoria.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit
{
  categoria: Categoria[] = [];
  productosPorCategoria: Producto[] = [];
  marcas: Marca[] = [];
  categoriaId?: number;
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoriaId = +params['id'];
      this.loadAllCategories();
      this.loadAllProducts();
    });
  }

  loadAllCategories(): void {
    this.cargaDatos = 'loading'; // Cambia el estado a loading al iniciar la carga
    this.categoriaService.list().subscribe(
      (categorias: Categoria[]) => {
        this.categoria = categorias.filter(m => m.idCategoria === this.categoriaId);
        this.cargaDatos = this.categoria.length > 0 ? 'done' : 'none'; // Actualiza el estado según los resultados
      },
      (error) => {
        this.cargaDatos = 'error'; // Establecer estado de error
        console.error('Error al cargar las categorias', error);
      }
    );
  }

  loadAllProducts(): void {
    this.cargaDatos = 'loading';

    this.productoService.list().subscribe(
      (productos: Producto[]) => {
        this.productosPorCategoria = productos.filter(producto => producto.idCategoria === this.categoriaId);
        this.cargaDatos = this.productosPorCategoria.length > 0 ? 'done' : 'none';
      },
      (error) => {
        this.cargaDatos = 'error';
        console.error('Error al cargar los productos', error);
      }
    );
  }

  getBrandName(idCategoria: number): string {
    const marca = this.categoria.find(m => m.idCategoria === idCategoria);
    return marca ? marca.categoriaNombre : 'Categoria no encontrada';
  }
}
