import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = 'http://186.122.146.132:8100//web/pdo/DemoWS/demo';

  usuario: UsuarioModel[];
  usuarios: UsuarioModel[] = [
    // {
    //   nrousu: 1,
    //   usuario: 'lhead',
    //   activo: true,
    //   clave: 'pjqtudckibycRKbj',
    //   nombre: 'Liam',
    //   apellido: 'Head Shot',
    //   email: '1026@chess.com',
    //   direccion: 'av. a calle b Lima - Perú',
    //   telefono: '123456789',
    //   imagen64: null
    // },
    // {
    //   nrousu: 2,
    //   usuario: 'acardozo',
    //   activo: true,
    //   clave: 'cqabiiVeTLcjgrFD',
    //   nombre: 'Alan',
    //   apellido: 'Cardozo',
    //   email: 'acardozo@chess.com',
    //   direccion: 'av. b calle c Cordova - Argentina',
    //   telefono: '445556667',
    //   imagen64: null
    // },
    // {
    //   nrousu: 3,
    //   usuario: 'abravo',
    //   activo: false,
    //   clave: 'ahlnhTczpihljbIn',
    //   nombre: 'Alejandra',
    //   apellido: 'Bravo',
    //   email: 'abravo@chess.com',
    //   direccion: 'av. b calle c La paz - Bolivia',
    //   telefono: '777888999',
    //   imagen64: null
    // },
    // {
    //   nrousu: 4,
    //   usuario: 'aluna',
    //   activo: true,
    //   clave: 'cnkdHdcZsjkaifkl',
    //   nombre: 'Alba',
    //   apellido: 'Luna',
    //   email: 'aluna@chess.com',
    //   direccion: 'av. b calle c Cali - Colombia',
    //   telefono: '45678903',
    //   imagen64: null
    // }
  ];



  constructor(private http: HttpClient) { }

  getUsuarios() {
    return this.http.put(`${this.url}/obtenerUsuarios`, {})
      .pipe(
        map((resp: any) => {
          this.usuarios = resp.response.dsUsuariosDemo.ttusuarios;
          return this.usuarios;
        })
      );
  }

  getUsuario(id: string) {
    this.usuario = this.usuarios.filter(user => {
      // tslint:disable-next-line: radix
      return user.nrousu === parseInt(id);
    });
    return this.usuario[0];
  }



  crearUsuario(usuario: UsuarioModel) {

    //  return this.usuarios.push(usuario);

    return this.http.put(`${this.url}/gestionarUsuarios`, JSON.parse(this.armarObjeto('create', usuario)));

  }

  actualizarUsuario(usuario: UsuarioModel) {



    // const usuarioTemp = {
    //   ...usuario
    // };

    // // delete usuarioTemp.nrousu;

    return this.http.put(`${this.url}/gestionarUsuarios`, JSON.parse(this.armarObjeto('update', usuario)));
  }


  borrarUsuario(usuario: UsuarioModel) {
    // return this.http.delete(`${this.url}`);
    return this.http.put(`${this.url}/gestionarUsuarios`, JSON.parse(this.armarObjeto('delete', usuario)));

  }


  armarObjeto(accion: string, users: UsuarioModel): string {

        return `{
      "request": {
          "pcaccion": "${accion}",
          "dsUsuariosDemo": {
              "ttusuarios": [${JSON.stringify(users)}]
          }
      }
    }`;
  }

}

