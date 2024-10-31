import { Component, OnInit } from '@angular/core';
import { Categoria, CategoriaBody } from '../../../../shared/models/categoria';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CategoriaService } from '../../../../shared/services/categoria.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent implements OnInit 
{
  createCategoriaState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormCategoria: 'none' | 'edit' | 'add' = 'none';
  formCategoria: FormGroup;
  categorias : Categoria[] = []

  selectedImage: File = new File([], '');
  uploadPercent: number = 0;
  downloadURL: string = '';

  isLoadingImage = false;

  administrador?: Administrador;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formCategoria = this.fb.group({
      categoriaNombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), this.noNumbersValidator]],
      imagen: [''],
      estado: [false, [Validators.required, this.isBoolean]], 
    });

  }

  ngOnInit(): void {
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
  }

  //CARAGAR A FIREBASE 
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

  createCategoria(): void {
    if (this.formCategoria.valid) {
      console.log(this.formCategoria.value);
      this.createCategoriaState = 'loading';
      
      this.categoriaService.create(this.formCategoria.value as CategoriaBody).subscribe({
        next: (data) => {
          this.createCategoriaState = 'done';
          this.categorias.push(data);
          this.formCategoria.reset(); // Reiniciar el formulario después de crear
          
          // Mostrar mensaje por unos segundos y luego ocultarlo
          setTimeout(() => {
            this.createCategoriaState = 'none';
          }, 3000); // Ocultar el mensaje después de 3 segundos
        },
        error: (err) => {
          console.error(err);
          this.createCategoriaState = 'error';
        }
      });
    } else {
      console.log('Formulario inválido.');
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

  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\s]*$/;  // Permitir solo letras y espacios
    if (control.value && !regex.test(control.value)) {
      return { noNumbers: true }; // Error si hay números
    }
    return null; // Válido si solo contiene letras
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
