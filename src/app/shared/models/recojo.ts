export interface Recojo {
    idRecojo:            number;
    fechaListo:          Date | null,
    fechaEntrega:        Date | null,
    responsableDeRecojo: string | null,
}

export interface RecojoBody{
    fechaListo:          Date | null,
    fechaEntrega:        Date | null,
    responsableDeRecojo: string | null,
}