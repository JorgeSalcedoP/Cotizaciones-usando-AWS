export class UsuarioModel {
    nrousu: number;
    usuario: string;
    activo: boolean;
    clave: string;
    nombre?: string;
    apellido?: string;
    email: string;
    direccion?: string;
    telefono?: string;
    imagen64?: string;

    constructor() {
        this.activo = true;
    }


}
