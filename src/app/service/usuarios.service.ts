import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'https://api-restaurant-i0e5.onrender.com/api/usuarios'; // URL de backend

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/lista`);
  }

  registrarUsuario(usuario: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/registrar`, usuario);
  }

  registrarUsuarioCliente(usuario: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/registrarCliente`, usuario);
  }

  updateUsuario(id: string, usuario: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/actualizar/${id}`, usuario);
  }

  deleteUsuario(id: string): Observable<User> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  loginAdmin(email: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/loginAdmin`;
    const body = { email, password };
    return this.http.post(url, body).pipe(
      map((response: any) => {
        console.log("consulto")
        if (response.token) {
          console.log("Respondio")
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token'); 
    return !!token;
  }

  loginCliente(email: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/loginCliente`;
    const body = { email, password };
    return this.http.post(url, body).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      })
    );
  }

  restablecerContrasena(token: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { nuevaContrasena });
  }

  cambiarContrasena(contrasenaActual: string, nuevaContrasena: string): Observable<any> {
    const token = this.getToken();
    console.log("token: " + token + "actual:"+contrasenaActual+"nueva :"+nuevaContrasena);
    const url = `${this.apiUrl}/cambiar-contrasena`;

    const body = {
      contrasenaActual,
      nuevaContrasena
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log("heder: ");

    return this.http.put(url, body, { headers });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
