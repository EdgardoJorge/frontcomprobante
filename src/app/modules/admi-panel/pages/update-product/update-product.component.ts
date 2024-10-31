import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Producto } from '../../../../shared/models/producto';
import { Categoria } from '../../../../shared/models/categoria';
import { ProductoService } from '../../../../shared/services/producto.service';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { MarcaService } from '../../../../shared/services/marca.service';
import { ActivatedRoute } from '@angular/router';
import { Marca } from '../../../../shared/models/marca';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = "none";
  createProductoState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormProducto: 'none' | 'edit' | 'add' = 'none';
  errorMessage: string | null = null;
  formProducto: FormGroup;
  producto : Producto | null = null;
  categoria : Categoria | null = null;
  marca : Marca | null = null;
  idProducto : number | null = null;
  categorias: Categoria[] = [];
  marcas: Marca[] = [];

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

  administrador?: Administrador;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formProducto = this.fb.group({
      productoNombre: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      precio: ['', [Validators.required, this.precisionValidator()]],
      precioOferta: ['', [this.precisionValidator()]],
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

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.activatedRoute.params.subscribe(params => {
      const idProducto = params['idProducto'];
      if (idProducto) {
        this.idProducto = +idProducto; // Guarda el idPersonal
        this.obtenerProducto(this.idProducto);
      }
    });
    this.listarCategorias();
    this.listarMarcas()
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

  obtenerProducto(idProducto: number): void {
    this.createProductoState = 'loading'; // Establecer estado de carga
    this.errorMessage = null; // Limpiar mensajes de error previos
  
    this.productoService.getById(idProducto).subscribe({
      next: (data: Producto) => {
        this.producto = data;
        this.formProducto.patchValue({
          productoNombre: data.productoNombre,
          precio: data.precio,
          precioOferta: data.precioOferta,
          cantidad: data.cantidad,
          detalle: data.detalle,
          estado: data.estado || null,
          imagen01: data.imagen01,
          imagen02: data.imagen02,
          imagen03: data.imagen03 || null,
          imagen04: data.imagen04 || null,
          idCategoria: data.idCategoria,
          idMarca: data.idMarca
        });
        // No establezcas createPersonalState a 'done' aquí
      },
      error: (err) => {
        console.error('Error al obtener los datos del personal:', err);
        this.createProductoState = 'error'; // Establecer estado de error
        this.errorMessage = 'Ocurrió un error al cargar los datos del personal. Inténtelo de nuevo más tarde.'; // Mensaje de error
      },
    });
  }

  actualizarProducto(): void {
    if (this.formProducto.valid && this.producto) {
      const updatedProducto = { ...this.producto, ...this.formProducto.value };
      this.productoService.update(updatedProducto).subscribe({
        next: (response) => {
          console.log('Prodcuto actualizado correctamente:', response);
          this.createProductoState = 'done'; // Establecer estado de éxito al actualizar
          setTimeout(() => {
            this.createProductoState = 'none'; // Reiniciar el estado después de 3 segundos
          }, 5000);
        },
        error: (err) => {
          console.error('Error al actualizar el categoria:', err);
          this.createProductoState = 'error'; // Establecer estado de error en caso de fallo
        },
      });
    } else {
      console.log('El formulario no es válido.');
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
