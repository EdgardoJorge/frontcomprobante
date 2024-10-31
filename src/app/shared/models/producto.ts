
export interface Producto {
    idProducto:      number;
    productoNombre:  string;
    precio:          number;
    precioOferta:    number | null,
    cantidad:        number;
    detalle:         string;
    estado:          boolean;
    imagen01:        string;
    imagen02:        string;
    imagen03:        string | null,
    imagen04:        string | null,
    idCategoria:     number;
    idMarca:         number;
  }

  export interface ProductoBody {
    productoNombre:  string;
    precio:          number;
    precioOferta:    number | null,
    cantidad:        number;
    detalle:         string;
    estado:          boolean;
    imagen01:        string;
    imagen02:        string;
    imagen03:        string | null,
    imagen04:        string | null,
    idCategoria:     number;
    idMarca:         number;
  }