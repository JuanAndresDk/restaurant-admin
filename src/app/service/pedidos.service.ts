import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  //==========SERVICIOS PARA PEDIDOS============//

  // Obtener todos los pedidos
  getPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/listar`);
  }

  // Obtener los pedidos de un cliente específico
  getPedidosByClienteId(clienteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/listarPorCliente/${clienteId}`);
  }

  // Agregar un nuevo pedido
  addPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos/agregar`, pedido);
  }

  // Actualizar un pedido por ID
  updatePedido(id: string, pedido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/actualizar/${id}`, pedido);
  }

  // Eliminar un pedido por ID
  deletePedido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/eliminar/${id}`);
  }

  //==========SERVICIOS PARA DETALLE PEDIDOS============//

  // Obtener los detalles de un pedido específico
  getDetallePedidoByPedidoId(pedidoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/detallesPedido/listarPorPedido/${pedidoId}`);
  }

  // Agregar un nuevo detalle al pedido
  addDetallePedido(detalle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/detallesPedido/agregar`, detalle);
  }

  // Actualizar un detalle del pedido por ID
  updateDetallePedido(pedidoId: string, id: string, detalle: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/detallesPedido/actualizar/${pedidoId}/${id}`, detalle);
  }

  // Eliminar un detalle del pedido por ID
  deleteDetallePedido(pedidoId: string, id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/detallesPedido/eliminar/${pedidoId}/${id}`);
  }
}
