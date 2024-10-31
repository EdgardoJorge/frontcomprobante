import { Component, OnInit } from '@angular/core';
import { Marca } from '../../../../shared/models/marca';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MarcaService } from '../../../../shared/services/marca.service';
import { ActivatedRoute } from '@angular/router';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrl: './update-brand.component.css'
})
export class UpdateBrandComponent implements OnInit
{
  createMarcaState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormMarca: 'none' | 'edit' | 'add' = 'none';
  errorMessage: string | null = null; // Added for error messages
  formMarca: FormGroup;
  marca: Marca | null = null;
  idMarca : number | null = null;

  selectedImage: File = new File([], '');
  uploadPercent: number = 0;
  downloadURL: string = '';

  isLoadingImage = false;
  administrador?: Administrador;
  constructor(
    private marcaService: MarcaService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ){
    this.formMarca = this.fb.group({
      marcaNombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      imagen: [''],
      estado: [false, [Validators.required, this.isBoolean]], // Boolean validation
    });
  }

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.activatedRoute.params.subscribe(params => {
      const idMarca = params['idMarca'];
      if (idMarca) {
        this.idMarca = +idMarca; 
        this.obtenerMarca(this.idMarca);
      }
    });
  }

  //CARGAR A FIREBASE 
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

  obtenerMarca(idMarca: number): void {
    this.createMarcaState = 'loading'; 
    this.errorMessage = null; 
  
    this.marcaService.getById(idMarca).subscribe({
      next: (data: Marca) => {
        this.marca = data;
        this.formMarca.patchValue({
          marcaNombre: data.marcaNombre,
          imagen: data.imagen,
          estado: data.estado,
        });
      },
      error: (err) => {
        console.error('Error al obtener los datos de la Marca:', err);
        this.createMarcaState = 'error';
        this.errorMessage = 'Ocurrió un error al cargar los datos de la Marca. Inténtelo de nuevo más tarde.'; // Mensaje de error
      },
    });
  }

  actualizarMarca(): void {
    if (this.formMarca.valid && this.marca) {
      const updatedMarca = { ...this.marca, ...this.formMarca.value };
      this.marcaService.update(updatedMarca).subscribe({
        next: (response) => {
          console.log('Marca actualizado correctamente:', response);
          this.createMarcaState = 'done'; // Establecer estado de éxito al actualizar
          setTimeout(() => {
            this.createMarcaState = 'none'; // Reiniciar el estado después de 3 segundos
          }, 5000);
        },
        error: (err) => {
          console.error('Error al actualizar la marca:', err);
          this.createMarcaState = 'error'; 
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

  // Validador valor sea un booleano el estado
  isBoolean(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (value !== true && value !== false) ? { 'notBoolean': true } : null;
  }
  
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
  
}
