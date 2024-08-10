import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PedidosService } from '../../service/pedidos.service';
import { Pedido } from '../../models/pedido.model';
import { DetallePedido } from '../../models/pedido.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  detalles: DetallePedido[] = [];
  pedidoForm: FormGroup;
  selectedPedido: Pedido | null = null;
  @ViewChild('pedidoModal') pedidoModal!: ElementRef;

  constructor(private pedidosService: PedidosService, private fb: FormBuilder) {
    this.pedidoForm = this.fb.group({
      id:[''],
      clienteId: [''],
      fecha: [''],
      total: ['']
    });
  }

  ngOnInit(): void {
    this.getPedidos();
  }

  getPedidos(): void {
    this.pedidosService.getPedidos().subscribe(data => {
      this.pedidos = data;
    });
  }

  openModal(pedido: Pedido): void {
    this.selectedPedido = pedido;
    this.pedidoForm.patchValue(pedido);
    this.getDetallePedido(pedido.id);
    const modalElement = this.pedidoModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal(): void {
    const modalElement = this.pedidoModal.nativeElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  getDetallePedido(pedidoId: string): void {
    this.pedidosService.getDetallePedidoByPedidoId(pedidoId).subscribe(data => {
      this.detalles = data;
    });
  }
}
