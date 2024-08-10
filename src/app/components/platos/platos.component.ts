import { Component, ElementRef, ViewChild } from '@angular/core';
import { PlatosService } from '../../service/platos.service';
import { Plato } from '../../models/plato.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasService } from '../../service/categorias.service';
import Swal from 'sweetalert2';
import { Categoria } from '../../models/categoria.model';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.css']
})
export class PlatosComponent {
  platos: Plato[] = [];
  categorias: Categoria[] = [];
  platoForm: FormGroup;
  isEdit = false;
  selectedPlato: Plato | null = null;
  @ViewChild('platoModal') platoModal!: ElementRef;
  imagenURL: string | ArrayBuffer | null = null;
  isLocalImage = true;
  originalImagenURL: string | null = null;

  constructor(private platoService: PlatosService, private categoriasService: CategoriasService, private fb: FormBuilder, private authService: AuthService) {
    this.platoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoriaId: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      imagen: [''],
    });
  }

  ngOnInit(): void {
    this.getPlatos();
    this.getCategorias();
  }

  getPlatos(): void {
    this.platoService.getPlatos().subscribe(data => {
      this.platos = data;
    });
  }

  getCategorias(): void {
    this.categoriasService.getCategorias().subscribe((data: Categoria[]) => {
      this.categorias = data;
    });
  }

  openModal(plato?: Plato): void {
    if (plato) {
      this.isEdit = true;
      this.selectedPlato = plato;
      this.platoForm.patchValue(plato);
      this.imagenURL = plato.imagen || null;
      this.originalImagenURL = plato.imagen || null;
    } else {
      this.isEdit = false;
      this.selectedPlato = null;
      this.imagenURL = null;
      this.originalImagenURL = null;
      this.platoForm.reset();
    }
    const modalElement = this.platoModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal(): void {
    const modalElement = this.platoModal.nativeElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  async onImageChange(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const filePath = `platos/${file.name}`;
        const downloadUrl = await this.uploadImage(filePath, dataUrl);
        this.imagenURL = downloadUrl;
      };
      reader.readAsDataURL(file);
      this.isLocalImage = true;
    }
  }

  async uploadImage(path: string, dataUrl: string): Promise<string> {
    const storageRef = ref(getStorage(), path);
    await uploadString(storageRef, dataUrl, 'data_url');
    return getDownloadURL(storageRef);
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(getStorage(), path);
    await deleteObject(storageRef);
  }

  async savePlato(): Promise<void> {
    if (this.platoForm.invalid) {
      return;
    }

    const formValue = this.platoForm.value;
    formValue.imagen = this.imagenURL;

    if (this.isEdit && this.selectedPlato) {
      const id = this.selectedPlato.id;
      if (id) {
        if (this.originalImagenURL !== this.imagenURL && this.originalImagenURL) {
          // Delete the old image if it has changed
          await this.authService.deleteFile(this.originalImagenURL);
        }
        this.platoService.updatePlato(id, formValue).subscribe({
          next: () => {
            Swal.fire('Actualizado!', 'El plato ha sido actualizado.', 'success');
            this.getPlatos();
            this.closeModal();
          },
          error: (err) => Swal.fire('Error!', 'Error al actualizar el plato.', 'error')
        });
      }
    } else {
      this.platoService.addPlato(formValue).subscribe({
        next: () => {
          Swal.fire('Guardado!', 'El plato ha sido registrado.', 'success');
          this.getPlatos();
          this.closeModal();
        },
        error: (err) => Swal.fire('Error!', 'Error al registrar el plato.', 'error')
      });
    }
  }

  async deletePlato(id: string, imagen: string): Promise<void> {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás recuperar este plato!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("IMAGEN: "+imagen)
          await this.authService.deleteFile(imagen);  // Primero elimina la imagen
          this.platoService.deletePlato(id).subscribe({  // Luego elimina el plato
            next: () => {
              Swal.fire('Eliminado!', 'El plato ha sido eliminado.', 'success');
              this.getPlatos();
            },
            error: (err) => Swal.fire('Error!', 'Error al eliminar el plato.', 'error')
          });
        } catch (error) {
          Swal.fire('Error!', 'Error al eliminar la imagen.', 'error');
        }
      }
    });
  }

  toggleImageSource(isLocal: boolean): void {
    this.isLocalImage = isLocal;
    this.imagenURL = null;
    this.platoForm.patchValue({ imagen: '' });
  }
}
