import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = 'http://localhost:3000/api/categorias'; // Reemplaza con tu URL de backend

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/listar`);
  }

  getCategoriaById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/listarPorId/${id}`);
  }

  addCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/agregar`, categoria);
  }

  updateCategoria(id: string, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/actualizar/${id}`, categoria);
  }

  deleteCategoria(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
