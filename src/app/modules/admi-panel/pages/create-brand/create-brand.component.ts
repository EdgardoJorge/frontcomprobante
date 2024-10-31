import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Marca, MarcaBody } from '../../../../shared/models/marca';
import { MarcaService } from '../../../../shared/services/marca.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrl: './create-brand.component.css'
})
export class CreateBrandComponent {

  createMarcaState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormMarca: 'none' | 'edit' | 'add' = 'none';
  formMarca: FormGroup;
  marcas : Marca[] = []

  selectedImage: File = new File([], '');
  uploadPercent: number = 0;
  downloadURL: string = '';

  isLoadingImage = false;

  administrador?: Administrador;

  constructor(
    private marcaService: MarcaService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formMarca = this.fb.group({
      marcaNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
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

      const filePath = `marcas/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe(percentage => {
      this.uploadPercent = Math.round(percentage ?? 0);
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
          this.formMarca.get('imagen')?.setValue(url);
        });
      })
    ).subscribe();
    this.isLoadingImage = true;
  }
}

  createMarca(): void {
    if (this.formMarca.valid) {
      console.log(this.formMarca.value);
      this.createMarcaState = 'loading';
      
      this.marcaService.create(this.formMarca.value as MarcaBody).subscribe({
        next: (data) => {
          this.createMarcaState = 'done';
          this.marcas.push(data);
          this.formMarca.reset(); // Reiniciar el formulario después de crear
          
          // Mostrar mensaje por unos segundos y luego ocultarlo
          setTimeout(() => {
            this.createMarcaState = 'none';
          }, 3000); // Ocultar el mensaje después de 3 segundos
        },
        error: (err) => {
          console.error(err);
          this.createMarcaState = 'error';
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

    const field = this.formMarca.get(fieldName);
    return field !== null && field.invalid && field.errors?.[Object.keys(field.errors)[0]] !== undefined && field.touched;
  }

  onSubmit(): void {
    const requiredFields = ['enlace', 'estado'];
    const invalidFields = requiredFields.filter(field => this.formMarca.get(field)?.invalid);
  
    if (invalidFields.length === 0) {
      console.log("Formulario válido y listo para enviar", this.formMarca.value);
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
