import { Component, OnInit } from '@angular/core';
import { Banner } from '../../../../shared/models/banner';
import { BannerService } from '../../../../shared/services/banner.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Administrador } from '../../../../shared/models/administrador';
@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.css'
})
export class BannersComponent implements OnInit {
  estadoCarga: 'none' | 'loading' | 'done' | 'error' = "none";
  banners: Banner[] = [];

  administrador?: Administrador;

  constructor(
    private bannerService: BannerService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.getAdministrador().subscribe({
      next: (value) => this.administrador = value
    });

    this.listarBanners();
  }

  listarBanners() {
    this.estadoCarga = 'loading';
    this.bannerService.list().subscribe({
        next: (data) => {
          this.estadoCarga = 'done';
          this.banners = data;
        },
        error: () => {
            this.estadoCarga = 'error';
        }
      });
  }

  eliminarBanner(banner: Banner) {
    banner.remove = true;
  }
  confirmarEliminar(idBanner: number) {
    // Show a confirmation dialog or modal
    if (confirm('¿Estás seguro de eliminar este banner?')) {
      this.bannerService.remove(idBanner).subscribe({
        next: () => {
          // Remove the deleted banner from the list
          this.banners = this.banners.filter(b => b.idBanner !== idBanner);
        },
        error: (error) => {
          console.error('Error deleting banner:', error);
          // Handle the error, e.g., show an error message to the user
        }
      });
    }
  }
  cancelarEliminar(banner: Banner) {
    banner.remove = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
