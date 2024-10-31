export interface Pedido{
    idPedido: number,
    fechaPedido: Date,
    fechaCancelado: Date | null,
    tipoPedido: string,
    estado: string,
    total: number,
    idCliente: number,
    idPersonal: number,
    idEnvio: number,
    idRecojo: number
}

export interface PedidoBody{
    fechaPedido: Date,
    fechaCancelado: Date | null,
    tipoPedido: string,
    estado: string,
    total: number,
    idCliente: number,
    idPersonal: number,
    idEnvio: number | null,
    idRecojo: number | null
}

export interface SumaTotalResponse {
    total: number;
}

export interface TotalPedidos {
    total: number;
}