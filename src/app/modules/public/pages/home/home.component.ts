import { Component, OnInit, Input } from '@angular/core';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Producto } from '../../../../shared/models/producto';
import { MarcaService } from '../../../../shared/services/marca.service';
import { Marca } from '../../../../shared/models/marca';
import { Banner } from '../../../../shared/models/banner';
import { BannerService } from '../../../../shared/services/banner.service';
import { Categoria } from '../../../../shared/models/categoria';
import { CategoriaService } from '../../../../shared/services/categoria.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  CargaDatos : 'none' | 'loading' | 'done' | 'error'='none';
  CargaDatosMarca: 'none' | 'loading' | 'done' | 'error' = 'none';
  cargaDatosBanner: 'none' | 'loading' | 'done' | 'error' = 'none';
  Productos: Producto[] = [];
  Marcas: Marca[] = [];
  Categorias:Categoria[]=[];
  @Input() banner: any[] = [];
  currentSlide = 0;

  constructor(
    private productoService:ProductoService,
    private marcaService:MarcaService,
    private bannerService:BannerService,
    private CategoriaService:CategoriaService
  ){}
  ngOnInit(): void {
    this.searchAll();
    this.SearchMarca();
    this.listAll();
    this.SearchCategoria();
  }
  searchAll(){
    this.CargaDatos = 'loading';
    this.productoService.list().subscribe({
      next: (data) =>{
        this.CargaDatos = 'done';
        this.Productos = data;
      },
      error: (_) => {
        this.CargaDatos= 'error';
      }
    });
  }
  SearchCategoria(){
    this.CargaDatosMarca = 'loading';
    this.CategoriaService.list().subscribe({
      next: (data) => {
        this.CargaDatosMarca = 'done';
        this.Categorias = data.map(marca => ({
          ...marca,
          idMarcas: marca.idCategoria.toString(),
        }));
      },
      error: (_) => {
        this.CargaDatosMarca = 'error';
      },
    });
  }
  SearchMarca(): void {
    this.CargaDatosMarca = 'loading';
    this.marcaService.list().subscribe({
      next: (data) => {
        this.CargaDatosMarca = 'done';
        this.Marcas = data.map(marca => ({
          ...marca,
          idMarcas: marca.idMarca.toString(),
        }));
      },
      error: (_) => {
        this.CargaDatosMarca = 'error';
      },
    });
  }
  listAll(){
    this.cargaDatosBanner='loading'
    this.bannerService.list().subscribe({
      next: (data) => {
        this.cargaDatosBanner= 'done';
        this.banner=data;
      },
      error: (_) =>{
        this.cargaDatosBanner = 'error'
      }
    })
  }
  nextSlide() {
    this.currentSlide =
      (this.currentSlide + 1) % this.banner.filter((b) => b.estado).length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.banner.filter((b) => b.estado).length) %
      this.banner.filter((b) => b.estado).length;
  }
  getBrandByIndex(index: number): any {
    const brandIndex = Math.floor(index / 4) % this.Marcas.length;
    return this.Marcas[brandIndex];
}
}

