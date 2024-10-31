export interface Personal{
    idPersonal: number,
    nombres: string,
    apellidos: string,
    rol: string,
    contacto: string,
    numeroDocumento: string,
    inicioOperacion: Date,
    finOperacion: Date | null,
}

export interface PersonalBody{
    nombres: string,
    apellidos: string,
    rol: string,
    contacto: string,
    numeroDocumento: string,
    inicioOperacion: Date,
    finOperacion: Date | null,
}