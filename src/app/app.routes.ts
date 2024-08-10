import { Routes } from '@angular/router';
import { PlatosComponent } from './components/platos/platos.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NewpasswordComponent } from './components/newpassword/newpassword.component';
import { PasswordresetComponent } from './components/passwordreset/passwordreset.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'platos', component: PlatosComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'newpassword/:token', component: NewpasswordComponent },
  { path: 'passwordreset', component: PasswordresetComponent, title: 'Actualizar contraseña', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
