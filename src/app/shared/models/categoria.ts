export interface Categoria {
    idCategoria: number,
    categoriaNombre: string,
    imagen: string,
    estado: boolean
}

export interface CategoriaBody {
    categoriaNombre: string,
    imagen: string,
    estado: boolean 
}