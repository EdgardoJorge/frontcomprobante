import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { Marca } from '../../../../shared/models/marca';
import { ProductoService } from '../../../../shared/services/producto.service';
import { MarcaService } from '../../../../shared/services/marca.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { Categoria } from '../../../../shared/models/categoria';


@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent  implements OnInit
{
  categoria: Categoria[] = [];
  productosPorMarca: Producto[] = [];
  marca: Marca[] = [];
  Marcaid?: number;
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.Marcaid = +params['id'];
      this.loadAllBrands();
      this.loadAllProducts();
    });
  }

  loadAllBrands(): void {
    this.cargaDatos = 'loading'; // Cambia el estado a loading al iniciar la carga
    this.marcaService.list().subscribe(
      (marcas: Marca[]) => {
        this.marca = marcas.filter(m => m.idMarca === this.Marcaid);
        this.cargaDatos = this.marca.length > 0 ? 'done' : 'none'; // Actualiza el estado según los resultados
      },
      (error) => {
        this.cargaDatos = 'error'; // Establecer estado de error
        console.error('Error al cargar las marcas', error);
      }
    );
  }

  loadAllProducts(): void {
    this.cargaDatos = 'loading'; // Cambia el estado a loading al iniciar la carga
    this.productoService.list().subscribe(
      (productos: Producto[]) => {
        this.productosPorMarca = productos.filter(producto => producto.idMarca === this.Marcaid);
        this.cargaDatos = this.productosPorMarca.length > 0 ? 'done' : 'none'; // Actualiza el estado según los resultados
      },
      (error) => {
        this.cargaDatos = 'error'; // Establecer estado de error
        console.error('Error al cargar los productos', error);
      }
    );
  }

  getBrandName(idMarca: number): string {
    const marca = this.marca.find(m => m.idMarca === idMarca);
    return marca ? marca.marcaNombre : 'Marca no encontrada';
  }



}
