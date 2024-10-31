import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AdministradorBody } from '../../../../shared/models/administrador';
import { AdministradorService } from '../../../../shared/services/administrador.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-collaborator',
  templateUrl: './create-collaborator.component.html',
  styleUrl: './create-collaborator.component.css'
})
export class CreateCollaboratorComponent implements OnInit
{
  createAdminState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormPersonal: 'none' | 'edit' | 'add' = 'none';
  formAdministrador: FormGroup;
  administradores : Administrador[] = []
  administrador?: Administrador;
  constructor(
    private administradorService: AdministradorService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formAdministrador = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noNumbersValidator]],
      telefonoMovil: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
      estado: [false, [Validators.required, this.isBoolean]],
      email: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30), this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

  }

  ngOnInit(): void {
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
  }

  createAdministrador(): void {
    console.log(this.formAdministrador.value);
    this.createAdminState = 'loading';
    this.administradorService.create(this.formAdministrador.value as AdministradorBody).subscribe({
      next: (data) => {
        this.createAdminState = 'done';
        this.administradores.push(data);
        this.formAdministrador.reset(); // Reiniciar el formulario después de crear
        // Mostrar mensaje por unos segundos y luego ocultarlo
        setTimeout(() => {
          this.createAdminState = 'none';
        }, 3000); // Ocultar el mensaje después de 3 segundos
      },
      error: (err) => {
        console.error(err);
        this.createAdminState = 'error';
      }
    });
  }

  // Método para validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formAdministrador.get(fieldName);
    return field !== null && field.invalid && (field.touched || field.dirty);
  }

  onSubmit(): void {
    if (this.formAdministrador.valid) {
      console.log("Formulario válido y listo para enviar", this.formAdministrador.value);
    } else {
      console.log("Formulario inválido");
    }
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
    return null; 
  }

  // Validador personalizado para asegurar que las contraseñas coincidan
  passwordMatchValidator(control: FormGroup): ValidationErrors | null {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');
  
    if (!passwordControl || !confirmPasswordControl) {
      return null; 
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
