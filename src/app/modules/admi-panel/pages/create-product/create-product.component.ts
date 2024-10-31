import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Producto, ProductoBody } from '../../../../shared/models/producto';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Categoria } from '../../../../shared/models/categoria';
import { Marca } from '../../../../shared/models/marca';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { MarcaService } from '../../../../shared/services/marca.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = "none";
  createProductoState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormProducto: 'none' | 'edit' | 'add' = 'none';
  formProducto: FormGroup;
  productos : Producto[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  administrador?: Administrador;

  selectedImage: File = new File([], '');
  uploadPercent01: number = 0;
  uploadPercent02: number = 0;
  uploadPercent03: number = 0;
  uploadPercent04: number = 0;
  downloadURL01: string = '';
  downloadURL02: string = '';
  downloadURL03: string = '';
  downloadURL04: string = '';

  isLoadingImage01 = false;
  isLoadingImage02 = false;
  isLoadingImage03 = false;
  isLoadingImage04 = false;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formProducto = this.fb.group({
      productoNombre: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      precio: ['', [Validators.required, this.precisionValidator()]],
      precioOferta: [0, [this.precisionValidator()]],
      cantidad: ['', [Validators.required]],
      detalle: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(5000)]],
      estado: [false, [Validators.required, this.isBoolean]],
      imagen01: [''],
      imagen02: [''],
      imagen03: [''],
      imagen04: [''],
      idCategoria: ['', [Validators.required]],
      idMarca: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.listarMarcas(),
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
  }

   //CARAGAR A FIREBASE  01
   onFileSelected01(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];  
  
      const filePath = `productos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
  
      task.percentageChanges().subscribe(percentage => {
        this.uploadPercent01 = Math.round(percentage ?? 0);
      });
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL01 = url;
            this.formProducto.get('imagen01')?.setValue(url);
          });
        })
      ).subscribe();
      this.isLoadingImage01 = true;
    }
  }

   //CARAGAR A FIREBASE  02
   onFileSelected02(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];  
  
      const filePath = `productos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
  
      task.percentageChanges().subscribe(percentage => {
        this.uploadPercent02 = Math.round(percentage ?? 0);
      });
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL02 = url;
            this.formProducto.get('imagen02')?.setValue(url);
          });
        })
      ).subscribe();
      this.isLoadingImage02 = true;
    }
  }

   //CARAGAR A FIREBASE  03
   onFileSelected03(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];  
  
      const filePath = `productos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
  
      task.percentageChanges().subscribe(percentage => {
        this.uploadPercent03 = Math.round(percentage ?? 0);
      });
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL03 = url;
            this.formProducto.get('imagen03')?.setValue(url);
          });
        })
      ).subscribe();
      this.isLoadingImage03 = true;
    }
  }

   //CARAGAR A FIREBASE  04
   onFileSelected04(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];  
  
      const filePath = `productos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
  
      task.percentageChanges().subscribe(percentage => {
        this.uploadPercent04 = Math.round(percentage ?? 0);
      });
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL04 = url;
            this.formProducto.get('imagen04')?.setValue(url);
          });
        })
      ).subscribe();
      this.isLoadingImage04 = true;
    }
  }

  createProducto(): void {
    if (this.formProducto.valid) {
      console.log(this.formProducto.value);
      this.createProductoState = 'loading';
      
      this.productoService.create(this.formProducto.value as ProductoBody).subscribe({
        next: (data) => {
          this.createProductoState = 'done';
          this.productos.push(data);
          this.formProducto.reset(); // Reiniciar el formulario después de crear
          
          // Mostrar mensaje por unos segundos y luego ocultarlo
          setTimeout(() => {
            this.createProductoState = 'none';
          }, 3000); // Ocultar el mensaje después de 3 segundos
        },
        error: (err) => {
          console.error(err);
          this.createProductoState = 'error';
        }
      });
    } else {
      console.log('Formulario inválido.');
    }
  }

  // Método para validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    // if (fieldName === 'imagen01') {
    //   return false;
    // }

    const field = this.formProducto.get(fieldName);
    return field !== null && field.invalid && field.errors?.[Object.keys(field.errors)[0]] !== undefined && field.touched;
  }

  onSubmit(): void {
    const requiredFields = ['productoNombre', 'precio', 'precioOferta', 'cantidad', 'detalle', 'estado', 'idCategoria', 'idMarca'];
    const invalidFields = requiredFields.filter(field => this.formProducto.get(field)?.invalid);
  
    if (invalidFields.length === 0) {
      console.log("Formulario válido y listo para enviar", this.formProducto.value);
    } else {
      console.log("Formulario inválido. Revisa los campos:", invalidFields)
      }
    }

  // Validador personalizado para asegurar que el valor sea un booleano
  isBoolean(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (value !== true && value !== false) ? { 'notBoolean': true } : null;
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

  precisionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      // Si el valor está vacío, no hay error
      if (!value) {
        return null;
      }
  
      // Expresión regular para permitir hasta 6 enteros y opcionalmente 2 decimales
      const regex = /^\d{1,6}(\.\d{1,2})?$/;
  
      // Verificar si el valor cumple con la expresión regular
      return regex.test(value) ? null : { precision: 'El precio debe tener hasta 6 dígitos enteros y 2 decimales como máximo' };
    };
  }
  
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
