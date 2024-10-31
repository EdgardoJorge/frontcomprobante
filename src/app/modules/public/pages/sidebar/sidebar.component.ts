import { Component, OnInit } from '@angular/core';
import { Marca } from '../../../../shared/models/marca';
import { MarcaService } from '../../../../shared/services/marca.service';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { Categoria } from '../../../../shared/models/categoria';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit
{

  cargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';
  cargaDatos2: 'none' | 'loading' | 'done' | 'error' = 'none';
  categorias: Categoria[] = [];
  Marcas: Marca[] = [];
  menuVisible = false;
  constructor(
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
  ){}
  ngOnInit(): void {
    this.listAll()
    this.listmarca()
  }

  listAll() {
    this.cargaDatos = 'loading';
    this.categoriaService.list().subscribe(
      (data) => {
        this.categorias = data;
        this.cargaDatos = 'done';
      },
      (error) => {
        console.error(error);
        this.cargaDatos = 'error';
      }
    );}
    listmarca() {
      this.cargaDatos2 = 'loading';
      this.marcaService.list().subscribe(
        (data) => {
          this.Marcas = data;
          this.cargaDatos2 = 'done';
        },
        (error) => {
          console.error(error);
          this.cargaDatos2 = 'error';
        }
      );}
  toggleMenu() {
    this.menuVisible = !this.menuVisible;}


}
