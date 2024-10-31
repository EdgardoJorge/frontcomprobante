import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../../../shared/services/personal.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Personal, PersonalBody } from '../../../../shared/models/personal';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff.component.html',
  styleUrl: './create-staff.component.css'
})
export class CreateStaffComponent implements OnInit 
{
  createPersonalState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormPersonal: 'none' | 'edit' | 'add' = 'none';
  formPersonal: FormGroup;
  personales : Personal[] = []
  
  administrador?: Administrador;

  constructor(
    private personalService: PersonalService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formPersonal = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noNumbersValidator]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noNumbersValidator]],
      rol: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), this.noNumbersValidator]],
      contacto: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(8)]]
    });

  }
  ngOnInit(): void {
    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
  }

  createPersonal(): void {
    console.log(this.formPersonal.value);
    this.createPersonalState = 'loading';
    this.personalService.create(this.formPersonal.value as PersonalBody).subscribe({
      next: (data) => {
        this.createPersonalState = 'done';
        this.personales.push(data);
        this.formPersonal.reset(); // Reiniciar el formulario después de crear
        // Mostrar mensaje por unos segundos y luego ocultarlo
        setTimeout(() => {
          this.createPersonalState = 'none';
        }, 3000); // Ocultar el mensaje después de 3 segundos
      },
      error: (err) => {
        console.error(err);
        this.createPersonalState = 'error';
      }
    });
  }

  // Método para validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formPersonal.get(fieldName);
    return field !== null && field.invalid && (field.touched || field.dirty);
  }

  // Validador personalizado para permitir solo letras
  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\s]*$/;  // Permitir solo letras y espacios
    if (control.value && !regex.test(control.value)) {
      return { noNumbers: true }; // Error si hay números
    }
    return null; // Válido si solo contiene letras
  }

  onSubmit(): void {
    if (this.formPersonal.valid) {
      console.log("Formulario válido y listo para enviar", this.formPersonal.value);
      // Aquí puedes llamar a un servicio o hacer alguna acción con los datos del formulario
    } else {
      console.log("Formulario inválido");
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
