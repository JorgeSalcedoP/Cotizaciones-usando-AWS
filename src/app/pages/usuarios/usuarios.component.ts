import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  searchText: string;
  usuarios: UsuarioModel[] = [];
  cargando = false;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
    this.cargando = true;
    this.traerUsuarios();
    console.log(JSON.parse(localStorage.getItem("permissionsByUser")));

  }

  traerUsuarios() {
    this.usuarioService.getUsuarios().subscribe(resp => {

      this.usuarios = resp;
      this.cargando = false;
    });
  }

  borrarUser(usuario: UsuarioModel) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar al usuario ${usuario.usuario}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        // this.usuarios.splice(i, 1);

        this.usuarioService.borrarUsuario(usuario).subscribe(respuesta => {

            Swal.fire({
              title: 'Eliminado',
              text: `El usuario ${usuario.usuario} fue Eliminado` ,
              icon: 'success'
            });
            this.traerUsuarios();

        });

        // this.router.navigate([ '/home']);

        // setTimeout(() => {
        //   this.router.navigate([ '/usuarios']);
        // }, 100);


        // this.usuarioService.borrarUsuario(usuario.nrousu).subscribe();
      }
    });


  }

}
