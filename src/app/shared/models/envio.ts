export interface Envio {
    idEnvio: number
    region: string
    provincia: string
    distrito: string
    localidad: string
    calle: string
    nDomicilio: string
    codigoPostal: string
    fechaEnvio: Date | null,
    fechaEntrega: Date | null,
    responsableEntrega: string | null,
    idPersonal: number | null
}

export interface EnvioBody {
    region: string
    provincia: string
    distrito: string
    localidad: string
    calle: string
    nDomicilio: string
    codigoPostal: string
    fechaEnvio: Date | null,
    fechaEntrega: Date | null,
    responsableEntrega: string | null,
    idPersonal: number,
}