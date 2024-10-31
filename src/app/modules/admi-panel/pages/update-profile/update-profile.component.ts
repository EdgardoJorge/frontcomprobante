import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Administrador } from '../../../../shared/models/administrador';
import { AdministradorService } from '../../../../shared/services/administrador.service';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent implements OnInit
{
  createAdminState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormAdmin: 'none' | 'edit' | 'add' = 'none';
  errorMessage: string | null = null;
  formAdministrador: FormGroup; 
  idAdministrador: number | null = null;
  administrador?: Administrador;
  constructor(
    private administradorService: AdministradorService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formAdministrador = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noNumbersValidator]],
      telefonoMovil: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
      estado: [false, [Validators.required, this.isBoolean]],
      email: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30), this.emailValidator]],
      actualPassword: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.activatedRoute.params.subscribe(params => {
      const idAdministrador = params['idAdministrador'];
      if (idAdministrador) {
        this.idAdministrador = +idAdministrador;
        this.obtenerAdministrador(this.idAdministrador);
      }
    });
  }

  obtenerAdministrador(idAdministrador: number): void {
    this.createAdminState = 'loading'; // Establecer estado de carga
    this.errorMessage = null; // Limpiar mensajes de error previos
  
    this.administradorService.getById(idAdministrador).subscribe({
      next: (data: Administrador) => {
        this.administrador = data;
        this.formAdministrador.patchValue({
          nombres: data.nombres,
          telefonoMovil: data.telefonoMovil,
          estado: data.estado,
          email: data.email,
        });
        // No establezcas createPersonalState a 'done' aquí
      },
      error: (err) => {
        console.error('Error al obtener los datos del personal:', err);
        this.createAdminState = 'error'; // Establecer estado de error
        this.errorMessage = 'Ocurrió un error al cargar los datos del personal. Inténtelo de nuevo más tarde.'; // Mensaje de error
      },
    });
  }

  actualizarAdministrador(): void {
    if (this.formAdministrador.valid && this.administrador) {
      const updatedAdmin = { ...this.administrador, ...this.formAdministrador.value };
      this.administradorService.update(updatedAdmin).subscribe({
        next: (response) => {
          console.log('Personal actualizado correctamente:', response);
          this.createAdminState = 'done'; // Set success state on update
          setTimeout(() => {
            this.createAdminState = 'none'; // Reset state after 3 seconds
          }, 3000);
        },
        error: (err) => {
          console.error('Error al actualizar el personal:', err);
          this.createAdminState = 'error'; // Set error state on failure
          this.errorMessage = 'Ocurrió un error al actualizar el personal. Verifique su contraseña actual e intente nuevamente.'; // Specific error message
        }
      });
    } else {
      console.log('El formulario no es válido.');
    }
  }

  onSubmit(): void {
    if (this.formAdministrador.valid) {
      console.log("Formulario válido y listo para enviar", this.formAdministrador.value);
      // Aquí puedes llamar a un servicio o hacer alguna acción con los datos del formulario
    } else {
      console.log("Formulario inválido");
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formAdministrador.get(fieldName);
    return field !== null && field.invalid && (field.touched || field.dirty);
  }

  // Validador personalizado para asegurar que el valor sea un booleano
  isBoolean(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (value !== true && value !== false) ? { 'notBoolean': true } : null;
  }

  // Validador personalizado para permitir solo letras
  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\s]*$/; 
    if (control.value && !regex.test(control.value)) {
      return { noNumbers: true }; 
    }
    return null; 
  }

  // Validar email
  emailValidator(control: any) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null; // Email is valid
  }

  // Validador personalizado para asegurar que las contraseñas coincidan
  passwordMatchValidator(control: FormGroup): ValidationErrors | null {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');
  
    if (!passwordControl || !confirmPasswordControl) {
      return null; // Controls might not be initialized yet
    }
  
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
  
    if (password !== confirmPassword) {
      return { passwordsDontMatch: true };
    }
  
    return null;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
