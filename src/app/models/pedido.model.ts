export interface Pedido {
    id: string;
    clienteId: string;
    fechaCreacion: Date;
    total: number;
}

export interface DetallePedido {
    id: string;
    pedidoId: string;
    platoId: string;
    platoNombre: string,
    platoImagen: string,
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}