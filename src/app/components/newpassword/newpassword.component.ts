import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  selector: 'app-newpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './newpassword.component.html',
  styleUrl: './newpassword.component.css'
})
export class NewpasswordComponent implements OnInit {
  token: string = '';
  nuevaContrasena: string = '';
  confirmacionContrasena: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit(): void {
    if (this.nuevaContrasena && this.confirmacionContrasena) {
      if (this.nuevaContrasena === this.confirmacionContrasena) {
        this.authService.restablecerContrasena(this.token, this.nuevaContrasena).subscribe({
          next: () => {
            Swal.fire({
              title: 'Éxito!',
              text: 'Tu contraseña ha sido restablecida con éxito.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo restablecer la contraseña. Asegúrate de que el enlace es válido y vuelve a intentarlo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Las contraseñas no coinciden. Por favor, vuelve a intentarlo.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      Swal.fire({
        title: 'Advertencia!',
        text: 'Por favor completa todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}