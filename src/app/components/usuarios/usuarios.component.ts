import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../service/usuarios.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuarioForm: FormGroup;
  @ViewChild('usuarioModal') usuarioModal!: ElementRef;

  constructor(private usuariosService: UsuariosService, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      id: [''],
      cedula: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      foto: [''],
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  openModal(usuario?: User): void {
    if (usuario) {
      this.usuarioForm.patchValue(usuario);
    } else {
      this.usuarioForm.reset();
    }
    const modalElement = this.usuarioModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal(): void {
    const modalElement = this.usuarioModal.nativeElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      return;
    }

    const formValue = this.usuarioForm.value;
    if (formValue.id) {
      this.usuariosService.updateUsuario(formValue.id, formValue).subscribe({
        next: () => {
          Swal.fire('Actualizado!', 'El usuario ha sido actualizado.', 'success');
          this.getUsuarios();
          this.closeModal();
        },
        error: (err) => Swal.fire('Error!', 'Error al actualizar el usuario.', 'error')
      });
    } else {
      this.usuariosService.registrarUsuario(formValue).subscribe({

        next: () => {
          Swal.fire('Guardado!', 'El usuario ha sido registrado.', 'success');
          this.getUsuarios();
          this.closeModal();
        },
        error: (err) => Swal.fire('Error!', 'Error al registrar el usuario.', 'error')
      });
    }
  }

  deleteUsuario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás recuperar este usuario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
            this.getUsuarios();
          },
          error: (err) => Swal.fire('Error!', 'Error al eliminar el usuario.', 'error')
        });
      }
    });
  }
}
