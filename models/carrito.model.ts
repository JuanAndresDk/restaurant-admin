export interface Carrito {
    id: string;
    clienteId: string;
    fechaCreacion: Date;
    total: number;
    estado: 'en proceso' | 'finalizado';
}

export interface DetalleCarrito {
    id: string;
    carritoId: string;
    platoId: string;
    platoNombre: string,
    platoImagen: string,
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}