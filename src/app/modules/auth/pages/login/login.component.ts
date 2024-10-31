import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit
{
  loginState: 'none' | 'loading' | 'done' | 'error' = "none";
  loginForm: FormGroup;
  arroba = '@'

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    
  }

  login(){
    this.loginState = 'loading';
    this.authService.login(this.loginForm.value).subscribe({
      next: (data)=>{
        this.loginState = 'done';
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) =>{
        this.loginState = 'error';
        setTimeout(() => {
          this.loginState = 'none';
        }, 3000);
      },
    })
  }

  // Método para validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field !== null && field.invalid && (field.touched || field.dirty);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log("Formulario válido y listo para enviar", this.loginForm.value);
    } else {
      console.log("Formulario inválido");
    }
  }
}
