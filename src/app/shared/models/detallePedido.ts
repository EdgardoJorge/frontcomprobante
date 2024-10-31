export interface DetallePedido {
    idDetallePedido: number,
    cantidad: number,
    precioUnitario: number,
    precioDescuento: number,
    subtotal: number,
    idProducto: number,
    idPedido: number
}

export interface DetallePedidoBody {
    cantidad: number,
    precioUnitario: number,
    precioDescuento: number | null,
    subtotal: number,
    idProducto: number,
    idPedido: number
}
