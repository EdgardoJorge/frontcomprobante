import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RucService } from '../../services/ruc.service';
import { DniService } from '../../services/dni.service'; 

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  switchState: boolean = false;
  rucData: any;
  dniData: any;
  noResultsDNI: boolean = false;
  noResultsRUC: boolean = false;
  gmailBoleta: string = '';
  celularBoleta: string = '';
  gmailFactura: string = '';
  celularFactura: string = '';

  constructor(private rucService: RucService, private dniService: DniService, private router: Router) {
    const storedSwitchState = localStorage.getItem('switchState');
    this.switchState = storedSwitchState ? JSON.parse(storedSwitchState) : false;
  }

  fetchRucData(ruc: string) {
    this.rucService.getRucData(ruc).subscribe({
      next: (data) => {
        this.rucData = data && (data.razonSocial || data.ruc) ? data : null;
        this.noResultsRUC = !this.rucData;
      },
      error: (error) => {
        console.error('Error al obtener datos del RUC:', error);
        this.rucData = null;
        this.noResultsRUC = true;
      }
    });
  }

  fetchDniData(dni: string) {
    this.dniService.getDniData(dni).subscribe({
      next: (data) => {
        this.dniData = data && (data.dni || data.nombres || data.apellidoPaterno || data.apellidoMaterno || data.codVerifica) ? data : null;
        this.noResultsDNI = !this.dniData;
      },
      error: (error) => {
        console.error('Error al obtener datos del DNI:', error);
        this.dniData = null;
        this.noResultsDNI = true;
      }
    });
  }

  toggleSwitch() {
    localStorage.setItem('switchState', JSON.stringify(this.switchState));
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isCelularValid(celular: string): boolean {
    const celularPattern = /^[0-9]{9}$/;
    return celularPattern.test(celular);
  }

  continue() {
    const isBoletaComplete = this.isEmailValid(this.gmailBoleta) && this.isCelularValid(this.celularBoleta);
    const isFacturaComplete = this.isEmailValid(this.gmailFactura) && this.isCelularValid(this.celularFactura);

    if (isBoletaComplete || isFacturaComplete) {
      if (isBoletaComplete) {
        localStorage.setItem('dniData', JSON.stringify(this.dniData));
        localStorage.setItem('gmailBoleta', this.gmailBoleta);
        localStorage.setItem('celularBoleta', this.celularBoleta);
      }
      if (isFacturaComplete) {
        localStorage.setItem('rucData', JSON.stringify(this.rucData));
        localStorage.setItem('gmailFactura', this.gmailFactura);
        localStorage.setItem('celularFactura', this.celularFactura);
      }
      this.router.navigate(['/recorrido/ubicacion']);
    } else {
      alert("Por favor, completa todos los datos de boleta o factura correctamente antes de continuar.");
    }
  }
}
