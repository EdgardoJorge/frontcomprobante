import { Component, OnInit } from '@angular/core';
import { UbigeoService } from '../../services/ubigeo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  switchState: boolean = false; // Envío y Recojo
  ubigeos: any[] = [];
  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: string[] = [];

  selectedDepartamento: string = '';
  selectedProvincia: string = '';
  selectedDistrito: string = '';
  referencia: string = ''; // Variable para la referencia
  CodigoPostal: string = '';

  // Variables para manejar errores
  departamentoError: boolean = false;
  provinciaError: boolean = false;
  distritoError: boolean = false;
  referenciaError: boolean = false;
  CodigoPostalError: boolean = false;

  formSubmitted: boolean = false; // Para mostrar mensaje de éxito

  constructor(private ubigeoService: UbigeoService, private router: Router) {}

  ngOnInit(): void {
    this.ubigeoService.getUbigeos().subscribe((data: any) => {
      this.ubigeos = data;
      this.departamentos = [...new Set(this.ubigeos.map((item: any) => item.departamento))];
    }, error => {
      console.error('Error al cargar los ubigeos:', error);
    });
  }

  onDepartamentoChange(): void {
    this.provincias = [
      ...new Set(
        this.ubigeos
          .filter((item: any) => item.departamento === this.selectedDepartamento)
          .map((item: any) => item.provincia)
      )
    ];
    this.distritos = [];
    this.selectedProvincia = '';
  }

  onProvinciaChange(): void {
    this.distritos = this.ubigeos
      .filter(
        (item: any) =>
          item.departamento === this.selectedDepartamento && item.provincia === this.selectedProvincia
      )
      .map((item: any) => item.distrito);
    this.selectedDistrito = '';
  }
  validateCodigoPostal() {
    this.CodigoPostalError = this.CodigoPostal.trim() === '' || !/^[0-9]*$/.test(this.CodigoPostal);
  }
  validateReferencia() {
    const regex = /N°\d+/; // Busca un guion seguido de uno o más dígitos
    this.referenciaError = this.referencia.trim() === '' || !regex.test(this.referencia);
  }
  continue(): void {
    if (this.switchState) {
        // Si es recojo, se permite continuar sin validar campos
        console.log('Formulario de recojo enviado');
        this.formSubmitted = true; // Indica que el formulario fue enviado
        this.router.navigate(['/recorrido/pago']);
        return;
    }

    // Validación para el formulario de envío
    this.departamentoError = !this.selectedDepartamento;
    this.provinciaError = !this.selectedProvincia;
    this.distritoError = !this.selectedDistrito;
    this.referenciaError = !this.referencia;
    this.CodigoPostalError = !this.CodigoPostal;

    if (this.departamentoError || this.provinciaError || this.distritoError || this.referenciaError || this.CodigoPostalError) {
        return; // No se envía el formulario si hay errores
    }

    console.log('Formulario enviado:', {
        departamento: this.selectedDepartamento,
        provincia: this.selectedProvincia,
        distrito: this.selectedDistrito,
        referencia: this.referencia,
        CodigoPostal: this.CodigoPostal
    });

    // Save data to local storage
    localStorage.setItem('selectedDepartamento', this.selectedDepartamento);
    localStorage.setItem('selectedProvincia', this.selectedProvincia);
    localStorage.setItem('selectedDistrito', this.selectedDistrito);
    localStorage.setItem('referencia', this.referencia);
    localStorage.setItem('CodigoPostal', this.CodigoPostal);

    this.formSubmitted = true; // Indica que el formulario fue enviado

    // Redirige a otra página (cambia la ruta según sea necesario)
    this.router.navigate(['/recorrido/pago']);
}
}