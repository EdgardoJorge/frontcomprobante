import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Producto } from '../../../../shared/models/producto';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit
{
  CargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';
  Productos: Producto[] = [];
  searchQuery: string = '';

  constructor(
    private ProductoService: ProductoService
  ) {}

  
  ngOnInit(): void {
  }

  onSearchInputChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.searchAll();
  }

  searchAll() {
    this.CargaDatos = 'loading';
    this.ProductoService.search(this.searchQuery).subscribe({
      next: (data) => {
        this.CargaDatos = 'done';
        this.Productos = data;
      },
      error: (_) => {
        this.CargaDatos = 'error';
      }
    });
  }
  cerrarPopUp(event: any) {
    if (event.target.classList.contains('bg-black')) {
      this.CargaDatos = 'none';
    }
  }
  limpiarInput() {
    const inputElement = document.querySelector('input.input') as HTMLInputElement;
    inputElement.value = '';
  }


}
