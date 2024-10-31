export interface Cliente{
    idCliente: number,
    razonSocial: string,
    email: string,
    telefonoMovil: string,
    tipoDocumento: string,
    numeroDocumento: string,
    direccionFiscal: string | null
}

export interface ClienteBody{
    idCliente: number,
    razonSocial: string,
    email: string,
    telefonoMovil: string,
    tipoDocumento: string,
    numeroDocumento: string,
    direccionFiscal: string | null
}