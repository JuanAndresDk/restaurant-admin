import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plato } from '../models/plato.model';

@Injectable({
  providedIn: 'root'
})
export class PlatosService {
  private apiUrl = 'http://localhost:3000/api/platos'; // URL de backend

  constructor(private http: HttpClient) {}

  getPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}/listar`);
  }

  getPlatoById(id: string): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/listarPorId/${id}`);
  }

  getPlatosByCategoria(categoriaId: string): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}/listarPorCategoria/${categoriaId}`);
  }

  addPlato(plato: Plato): Observable<Plato> {
    return this.http.post<Plato>(`${this.apiUrl}/agregar`, plato);
  }

  updatePlato(id: string, plato: Plato): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/actualizar/${id}`, plato);
  }

  deletePlato(id: string): Observable<Plato> {
    return this.http.delete<Plato>(`${this.apiUrl}/eliminar/${id}`);
  }
}
