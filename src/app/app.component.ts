import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavService } from './service/nav.service';
import { AuthService } from './service/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UsuariosService } from './service/usuarios.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'restaurant-app';
  isLoginPage: boolean = false;
  constructor(
    private router: Router,
    private navService: NavService,
    private authService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isLoginPage = url === '/login';

      }
    });
  }

  ngAfterViewInit() {
    this.navService.init();
  }

  logout(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
