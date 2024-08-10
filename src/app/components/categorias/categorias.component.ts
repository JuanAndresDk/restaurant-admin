import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriasService } from '../../service/categorias.service';
import { Categoria } from '../../models/categoria.model';
import { PlatosService } from '../../service/platos.service';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriaForm: FormGroup;
  isEdit = false;
  selectedCategoria: Categoria | null = null;
  @ViewChild('categoriaModal') categoriaModal!: ElementRef;
  isLocalImage = true;
  imagenURL: string | ArrayBuffer | null = null;
  originalImagenURL: string | null = null;

  constructor(private authService: AuthService, private platosService: PlatosService, private categoriasService: CategoriasService, private fb: FormBuilder) {
    this.categoriaForm = this.fb.group({
      nombres: ['', Validators.required],
      img: ['']
    });
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.categoriasService.getCategorias().subscribe((data: Categoria[]) => {
      this.categorias = data;
    });
  }

  async saveCategoria(): Promise<void> {
    if (this.categoriaForm.invalid) {
      console.log("form invalid");
      return;
    }

    const formValue = this.categoriaForm.value;
    formValue.img = this.imagenURL;

    console.log('Datos enviados:', formValue);

    if (this.isEdit && this.selectedCategoria) {
      const id = this.selectedCategoria.id;
      if (id) {
        if (this.originalImagenURL !== this.imagenURL && this.originalImagenURL) {
          await this.deleteFile(this.originalImagenURL);
        }
        this.categoriasService.updateCategoria(id, formValue).subscribe({
          next: () => {
            Swal.fire('Actualizado!', 'La categoría ha sido actualizada.', 'success');
            this.getCategorias();
            this.closeModal();
          },
          error: (err) => Swal.fire('Error!', 'Error al actualizar la categoría.', 'error')
        });
      }
    } else {
      this.categoriasService.addCategoria(formValue).subscribe({
        next: () => {
          Swal.fire('Guardado!', 'La categoría ha sido guardada.', 'success');
          this.getCategorias();
          this.categoriaForm.reset();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al guardar la categoría:', err);
          Swal.fire('Error!', 'Error al guardar la categoría.', 'error');
        }
      });
    }
  }

  async onImageChange(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const filePath = `categorias/${file.name}`;
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

  resizeImage(imageDataUrl: string, maxWidth: number, maxHeight: number): void {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        this.imagenURL = canvas.toDataURL('image/jpeg');
      }
    };
    img.src = imageDataUrl;
  }

  toggleImageSource(isLocal: boolean): void {
    this.isLocalImage = isLocal;
    this.imagenURL = null;
    this.categoriaForm.patchValue({ imagen: '' });
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(getStorage(), path);
    await deleteObject(storageRef);
  }

  openModal(categoria?: Categoria): void {
    if (categoria) {
      console.log("cat: " + categoria.nombres)
      this.isEdit = true;
      this.selectedCategoria = categoria;
      this.categoriaForm.patchValue(categoria);
      this.imagenURL = categoria.img || null;

    } else {
      this.isEdit = false;
      this.selectedCategoria = null;
      this.categoriaForm.reset();
      this.imagenURL = null;
    }
    const modalElement = this.categoriaModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal(): void {
    const modalElement = this.categoriaModal.nativeElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  async deleteCategoria(id: string, imagen: string): Promise<void> {
    this.platosService.getPlatosByCategoria(id).subscribe(platos => {
      if (platos.length > 0) {
        Swal.fire('Error!', 'No se puede eliminar la categoría porque tiene platos asignados.', 'error');
      } else {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás recuperar esta categoría!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, elimínala!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log(id);
            await this.authService.deleteFile(imagen);  // Primero elimina la imagen
            this.categoriasService.deleteCategoria(id).subscribe({
              next: () => {
                Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
                this.getCategorias();
              },
              error: (err) => Swal.fire('Error!', 'Error al eliminar la categoría.', 'error')
            });
          }
        });
      }
    }, error => {
      Swal.fire('Error!', 'Error al verificar los platos de la categoría.', 'error');
    });
  }
}
