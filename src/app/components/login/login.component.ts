import { AuthService } from './../../service/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: UsuariosService, private router: Router) {}

  onLogin(): void {
    this.authService.loginAdmin(this.email, this.password).subscribe(() => {
      Swal.fire({
        title: 'Éxito!',
        text: '¡Has iniciado sesión correctamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/platos']);
      });
    }, error => {
      Swal.fire({
        title: 'Error!',
        text: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }
  
  redirectToForgotPassword(): void {
    this.router.navigate(['/forgotpassword']).then(success => {
    });
  } 
}

