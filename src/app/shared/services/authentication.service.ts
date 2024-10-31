import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { environment } from '../../../environments/environment.development';
import { LoginRequest } from '../models/login-request';
import { Administrador } from '../models/administrador';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private administrador?: Administrador;
  private exp: Date = new Date();
  private timmer?: any;
  private administradorSubject: BehaviorSubject<Administrador | undefined>;

  constructor( private http: HttpClient, private router: Router) {
    const administradorData = localStorage.getItem('administrador')
    if (administradorData) {
      try {
        this.administrador = JSON.parse(administradorData);
      } catch (error) {
        console.error('Error al parsear el administrador desde localStorage:', error);
        this.administrador = undefined; // O maneja el error de otra manera
      }
    } else {
      this.administrador = undefined; // Manejo de caso donde no hay datos
    }
    this.administradorSubject = new BehaviorSubject(this.administrador);
  }

  getAdministradorX(): Administrador | undefined {
    return this.administrador
  };

  getAdministrador(): Observable<Administrador | undefined> {
    return this.administradorSubject.asObservable();
  }

  setAdministrador(administrador: Administrador | undefined) {
    this.administrador = administrador;
    this.administradorSubject.next(this.administrador);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    const url = `${environment.backendBaseUrl}/api/auth/login`;
    return this.http.post<LoginResponse>(url, data).pipe(
      tap( (response) => this.processLogin(response)
      )
    );
  }

  logout() {
    this.administrador = undefined;
    localStorage.clear();
    this.administradorSubject.next(undefined);
    this.router.navigateByUrl('/');
  }

  private processLogin(res: LoginResponse) {
    this.administrador = res.administrador;
    this.administradorSubject.next(this.administrador);
    localStorage.setItem('jwt', res.token);
    localStorage.setItem('administrador', JSON.stringify(res.administrador));
    const decoded = jwtDecode(res.token)
    if(decoded && decoded.exp) {
      this.exp = new Date(decoded.exp * 1000);
      clearInterval(this.timmer);
      this.timmer = setInterval(()=> {
        const now  = new Date();
        // console.log(now, this.exp);
        if (now >= this.exp) {
          this.logout();
          clearInterval(this.timmer);
        }
      },5000)
    }
  }
}

// luis@fibertel.com