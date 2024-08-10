import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  selector: 'app-passwordreset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passwordreset.component.html',
  styleUrl: './passwordreset.component.css'
})
export class PasswordresetComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService: UsuariosService) {}

  onChangePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.authService.cambiarContrasena(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        Swal.fire({
          title: 'Éxito!',
          text: 'La contraseña se ha cambiado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.authService.logout();
          window.location.href = '/login';
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cambiar la contraseña. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}