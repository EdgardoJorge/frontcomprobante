import { Component, OnInit } from '@angular/core';
import { Administrador } from '../../../../shared/models/administrador';
import { ActivatedRoute } from '@angular/router';
import { AdministradorService } from '../../../../shared/services/administrador.service';

import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit
{
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = 'loading';
  administrador: Administrador | undefined;
  idAdministrador: number | null = null;
  // administrador?: Administrador;

  constructor(
    private activatedRoute: ActivatedRoute,
    private administradorService: AdministradorService,
    private authService: AuthenticationService,
    private router: Router
  ){}

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.activatedRoute.params.subscribe(params => {
      const idAdministradorParam = params['idAdministrador'];
      if (idAdministradorParam) {
        this.idAdministrador = +idAdministradorParam;
        this.cargarAdministrador(this.idAdministrador);
      } else {
        // Handle case where idAdministrador is not provided
        this.estadoCarga = 'error';
      }
    });
  }

  cargarAdministrador(idAdministrador: number): void {
    this.administradorService.getById(idAdministrador).subscribe({
      next: (administrador) => {
        this.administrador = administrador;
        this.estadoCarga = 'done';
      },
      error: (error) => {
        console.error('Error al cargar administrador:', error);
        this.estadoCarga = 'error';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
