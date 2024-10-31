import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Banner, BannerBody } from '../../../../shared/models/banner';
import { BannerService } from '../../../../shared/services/banner.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrl: './create-banner.component.css'
})
export class CreateBannerComponent implements OnInit
{
  createBannerState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormCategoria: 'none' | 'edit' | 'add' = 'none';
  formBanner: FormGroup;
  banners : Banner[] = []

  selectedImage: File = new File([], '');
  uploadPercent: number = 0;
  downloadURL: string = '';

  isLoadingImage = false;
  administrador?: Administrador;

  constructor(
    private categoriaService: BannerService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private authService: AuthenticationService,
    private router: Router
  ) {
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

  createBanner(): void {
    if (this.formBanner.valid) {
      console.log(this.formBanner.value);
      this.createBannerState = 'loading';

      this.categoriaService.create(this.formBanner.value as BannerBody).subscribe({
        next: (data) => {
          this.createBannerState = 'done';
          this.banners.push(data);
          this.formBanner.reset(); // Reiniciar el formulario después de crear
          
          // Mostrar mensaje por unos segundos y luego ocultarlo
          setTimeout(() => {
            this.createBannerState = 'none';
          }, 3000); // Ocultar el mensaje después de 3 segundos
        },
        error: (err) => {
          console.error(err);
          this.createBannerState = 'error';
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

    const field = this.formBanner.get(fieldName);
    return field !== null && field.invalid && field.errors?.[Object.keys(field.errors)[0]] !== undefined && field.touched;
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

  // Validador valor boolean para el estado
  isBoolean(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (value !== true && value !== false) ? { 'notBoolean': true } : null;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }


}
