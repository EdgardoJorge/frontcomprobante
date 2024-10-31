import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Categoria } from '../../../../shared/models/categoria';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { ActivatedRoute } from '@angular/router';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent implements OnInit
{
  createCategoriaState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormCategoria: 'none' | 'edit' | 'add' = 'none';
  errorMessage: string | null = null;
  formCategoria: FormGroup;
  categoria: Categoria | null = null;
  idCategoria : number | null = null;

  selectedImage: File = new File([], '');
  uploadPercent: number = 0;
  downloadURL: string = '';

  isLoadingImage = false;

  administrador?: Administrador;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ){
    this.formCategoria = this.fb.group({
      categoriaNombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      imagen: [''],
      estado: [false, [Validators.required, this.isBoolean]], 
    });
  }

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.activatedRoute.params.subscribe(params => {
      const idCategoria = params['idCategoria'];
      if (idCategoria) {
        this.idCategoria = +idCategoria;
        this.obtenerCategoria(this.idCategoria);
      }
    });
  }

   //CARGAR A FIREBASE 
   onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];   

      const filePath = `categorias/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe(percentage => {
      this.uploadPercent = Math.round(percentage ?? 0);
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
          this.formCategoria.get('imagen')?.setValue(url);
        });
      })
    ).subscribe();
    this.isLoadingImage = true;
  }
}
  obtenerCategoria(idCategoria: number): void {
    this.createCategoriaState = 'loading'; // Establecer estado de carga
    this.errorMessage = null; // Limpiar mensajes de error previos
  
    this.categoriaService.getById(idCategoria).subscribe({
      next: (data: Categoria) => {
        this.categoria = data;
        this.formCategoria.patchValue({
          categoriaNombre: data.categoriaNombre,
          imagen: data.imagen,
          estado: data.estado,
        });
      },
      error: (err) => {
        console.error('Error al obtener los datos del personal:', err);
        this.createCategoriaState = 'error'; // Establecer estado de error
        this.errorMessage = 'Ocurrió un error al cargar los datos del personal. Inténtelo de nuevo más tarde.'; // Mensaje de error
      },
    });
  }

  actualizarCategoria(): void {
    if (this.formCategoria.valid && this.categoria) {
      const updatedCategoria = { ...this.categoria, ...this.formCategoria.value };
      this.categoriaService.update(updatedCategoria).subscribe({
        next: (response) => {
          console.log('Categoria actualizado correctamente:', response);
          this.createCategoriaState = 'done'; // Establecer estado de éxito al actualizar
          setTimeout(() => {
            this.createCategoriaState = 'none'; // Reiniciar el estado después de 3 segundos
          }, 5000);
        },
        error: (err) => {
          console.error('Error al actualizar el categoria:', err);
          this.createCategoriaState = 'error'; // Establecer estado de error en caso de fallo
        },
      });
    } else {
      console.log('El formulario no es válido.');
    }
  }

  // Método para validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    if (fieldName === 'imagen') {
      return false;
    }

    const field = this.formCategoria.get(fieldName);
    return field !== null && field.invalid && field.errors?.[Object.keys(field.errors)[0]] !== undefined && field.touched;
  }

  onSubmit(): void {
    const requiredFields = ['enlace', 'estado'];
    const invalidFields = requiredFields.filter(field => this.formCategoria.get(field)?.invalid);
  
    if (invalidFields.length === 0) {
      console.log("Formulario válido y listo para enviar", this.formCategoria.value);
    } else {
      console.log("Formulario inválido. Revisa los campos:", invalidFields)
      }
    }

  // Validador personalizado para asegurar que el valor sea un booleano
  isBoolean(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (value !== true && value !== false) ? { 'notBoolean': true } : null;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
  
}
