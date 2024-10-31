import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Banner } from '../../../../shared/models/banner';
import { BannerService } from '../../../../shared/services/banner.service';
import { ActivatedRoute } from '@angular/router';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-banner',
  templateUrl: './update-banner.component.html',
  styleUrl: './update-banner.component.css'
})
export class UpdateBannerComponent implements OnInit
{
  createBannerState: 'none' | 'loading' | 'done' | 'error' = "none";
  showBanner: 'none' | 'edit' | 'add' = 'none';
  errorMessage: string | null = null; 
  formBanner: FormGroup;
  banner: Banner | null = null;
  idBanner : number | null = null;

  selectedImage: File = new File([], '');
  uploadPercent: number = 0;
  downloadURL: string = '';

  isLoadingImage = false;
  administrador?: Administrador;
  constructor(
    private bannerService: BannerService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ){
    this.formBanner = this.fb.group({
      imagen: [''],
      enlace: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      estado: [false, [Validators.required, this.isBoolean]],
    });
  }

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.activatedRoute.params.subscribe(params => {
      const idBanner = params['idBanner'];
      if (idBanner) {
        this.idBanner = +idBanner; 
        this.obtenerBanner(this.idBanner);
      }
    });
  }

  //CARGAR A FIREBASE 
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];   

      const filePath = `banners/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe(percentage => {
      this.uploadPercent = Math.round(percentage ?? 0);
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
          this.formBanner.get('imagen')?.setValue(url);
        });
      })
    ).subscribe();
    this.isLoadingImage = true;
  }
}

  obtenerBanner(idBanner: number): void {
    this.createBannerState = 'loading'; 
    this.errorMessage = null; 
  
    this.bannerService.getById(idBanner).subscribe({
      next: (data: Banner) => {
        this.banner = data;
        this.formBanner.patchValue({
          imagen: data.imagen,
          enlace: data.enlace,
          estado: data.estado,
        });
      },
      error: (err) => {
        console.error('Error al obtener los datos del banner:', err);
        this.createBannerState = 'error'; // Establecer estado de error
        this.errorMessage = 'Ocurrió un error al cargar los datos del banner. Inténtelo de nuevo más tarde.'; // Mensaje de error
      },
    });
  }

  actualizarBanner(): void {
    if (this.formBanner.valid && this.banner) {
      const updatedBanner = { ...this.banner, ...this.formBanner.value };
      this.bannerService.update(updatedBanner).subscribe({
        next: (response) => {
          console.log('Marca actualizado correctamente:', response);
          this.createBannerState = 'done'; // Establecer estado de éxito al actualizar
          setTimeout(() => {
            this.createBannerState = 'none'; // Reiniciar el estado después de 3 segundos
          }, 5000);
        },
        error: (err) => {
          console.error('Error al actualizar la marca:', err);
          this.createBannerState = 'error'; 
        },
      });
    } else {
      console.log('El formulario no es válido.');
    }
  }

  onSubmit(): void {
    const requiredFields = ['enlace', 'estado'];
    const invalidFields = requiredFields.filter(field => this.formBanner.get(field)?.invalid);
  
    if (invalidFields.length === 0) {
      console.log("Formulario válido y listo para enviar", this.formBanner.value);
    } else {
      console.log("Formulario inválido. Revisa los campos:", invalidFields)
      }
    }
  
  // Método para validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    if (fieldName === 'imagen') {
      return false;
    }

    const field = this.formBanner.get(fieldName);
    return field !== null && field.invalid && field.errors?.[Object.keys(field.errors)[0]] !== undefined && field.touched;
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
