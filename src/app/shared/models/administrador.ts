
export interface Administrador {
    idAdministrador: number,
    nombres: string,
    telefonoMovil: string,
    estado: boolean,
    email: string,
    password: string,
    confirmPassword: string | null,
}

export interface AdministradorBody {
    idAdministrador: number,
    nombres: string,
    telefonoMovil: string,
    estado: boolean,
    email: string,
    password: string,
    confirmPassword: string | null,
}