  import { Component, OnInit } from '@angular/core';
  import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
  import { Personal } from '../../../../shared/models/personal';
  import { PersonalService } from '../../../../shared/services/personal.service';
  import { ActivatedRoute } from '@angular/router';

  import { AuthenticationService } from '../../../../shared/services/authentication.service';
  import { Administrador } from '../../../../shared/models/administrador';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-update-staff',
    templateUrl: './update-staff.component.html',
    styleUrl: './update-staff.component.css'
  })
  export class UpdateStaffComponent implements OnInit
  {
    createPersonalState: 'none' | 'loading' | 'done' | 'error' = "none";
    showFormPersonal: 'none' | 'edit' | 'add' = 'none';
    errorMessage: string | null = null;
    formPersonal: FormGroup;
    personal: Personal | null = null; 
    idPersonal: number | null = null;

    administrador?: Administrador;

    constructor(
      private personalService: PersonalService,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private authService: AuthenticationService,
      private router: Router
      
    ) {
      this.formPersonal = this.fb.group({
        nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noNumbersValidator]],
        apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noNumbersValidator]],
        rol: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), this.noNumbersValidator]],
        contacto: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
        numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(8)]],
        finOperacion: [null],
      }); 
    }

    ngOnInit(): void {

      this.authService.getAdministrador().subscribe({
        next: (value) => this.administrador = value
      });

      this.activatedRoute.params.subscribe(params => {
        const idPersonal = params['idPersonal'];
        if (idPersonal) {
          this.idPersonal = +idPersonal; // Guarda el idPersonal
          this.obtenerPersonal(this.idPersonal);
        }
      });
    }
  

    obtenerPersonal(idPersonal: number): void {
      this.createPersonalState = 'loading'; // Establecer estado de carga
      this.errorMessage = null; // Limpiar mensajes de error previos
    
      this.personalService.getById(idPersonal).subscribe({
        next: (data: Personal) => {
          this.personal = data;
          this.formPersonal.patchValue({
            nombres: data.nombres,
            apellidos: data.apellidos,
            rol: data.rol,
            contacto: data.contacto,
            numeroDocumento: data.numeroDocumento,
            finOperacion: data.finOperacion || null // Asegurarse de que no sea undefined
          });
          // No establezcas createPersonalState a 'done' aquí
        },
        error: (err) => {
          console.error('Error al obtener los datos del personal:', err);
          this.createPersonalState = 'error'; // Establecer estado de error
          this.errorMessage = 'Ocurrió un error al cargar los datos del personal. Inténtelo de nuevo más tarde.'; // Mensaje de error
        },
      });
    }
    
  
    actualizarPersonal(): void {
      if (this.formPersonal.valid && this.personal) {
        const updatedPersonal = { ...this.personal, ...this.formPersonal.value };
        this.personalService.update(updatedPersonal).subscribe({
          next: (response) => {
            console.log('Personal actualizado correctamente:', response);
            this.createPersonalState = 'done'; // Establecer estado de éxito al actualizar
            setTimeout(() => {
              this.createPersonalState = 'none'; // Reiniciar el estado después de 3 segundos
            }, 5000);
          },
          error: (err) => {
            console.error('Error al actualizar el personal:', err);
            this.createPersonalState = 'error'; // Establecer estado de error en caso de fallo
          },
        });
      } else {
        console.log('El formulario no es válido.');
      }
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

    isFieldInvalid(fieldName: string): boolean {
      const field = this.formPersonal.get(fieldName);
      return field !== null && field.invalid && (field.touched || field.dirty);
    }
    
    logout() {
      this.authService.logout();
      this.router.navigateByUrl('/');
    }

  }
