import { Component, OnInit } from '@angular/core';
import { Administrador } from '../../../../shared/models/administrador';
import { AdministradorService } from '../../../../shared/services/administrador.service';
import { Personal } from '../../../../shared/models/personal';
import { PersonalService } from '../../../../shared/services/personal.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.css'
})
export class CollaboratorsComponent implements OnInit
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = "none";
  administradores: Administrador[] = [];
  personales: Personal[] = [];

  administrador?: Administrador;

  constructor(
    private administradorService: AdministradorService,
    private personalService: PersonalService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });
    this.listarPersonales();
    this.listarAdministradores();
  }

  listarAdministradores() {
    this.estadoCarga = 'loading';
    this.administradorService.list().subscribe({
        next: (data) => {
          this.estadoCarga = 'done';
          this.administradores = data;
        },
        error: () => {
            this.estadoCarga = 'error';
        }
      });
  }

  listarPersonales() {
    this.estadoCarga = 'loading';
    this.personalService.list().subscribe({
        next: (data) => {
          this.estadoCarga = 'done';
          this.personales = data;
        },
        error: () => {
            this.estadoCarga = 'error';
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
