export interface Banner {
    idBanner: number,
    imagen: string,
    enlace: string,
    estado: boolean,
    remove?: boolean,
}

export interface BannerBody {
    imagen: string,
    enlace: string,
    estado: boolean,
  }