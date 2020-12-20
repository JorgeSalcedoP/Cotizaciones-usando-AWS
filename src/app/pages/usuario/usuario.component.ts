import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, NgForm, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  forma: FormGroup;
  usuario = new UsuarioModel();
  imagen: string | ArrayBuffer;
  formatosImg = ['jpg', 'png', 'jpeg'];
  mensaje = undefined;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute) {
    this.forma = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      activo: new FormControl(''),
      clave: new FormControl('', [Validators.required]),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      direccion: new FormControl(''),
      telefono: new FormControl(''),
      imagen64: new FormControl('')
    });

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.usuario = this.usuarioService.getUsuario(id);
      this.usuario.nrousu = parseInt(id);
    }
  }


  guardarCambios(valorimageg4) {
    console.log(valorimageg4);

    if (this.forma.invalid) {
      console.log('Formulario no valido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;

    if (this.usuario.nrousu) {
      this.usuario.imagen64 = valorimageg4;

      peticion = this.usuarioService.actualizarUsuario(this.usuario);
    } else {

      peticion = this.usuarioService.crearUsuario(this.usuario);
    }

    peticion.subscribe(resp => {
      console.log(resp);
      if (resp.response.pcErr) {
        Swal.fire({
          title: 'Error al procesar información',
          text: resp.response.pcErr,
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'El usuario ' + this.usuario.usuario,
          text: this.usuario.nrousu ? 'Se actualizó correctamente' : 'Se creó correctamente',
          icon: 'success'
        });
      }
    });

  }



  //#region Subida de archivo ----------------------------------------------------------
  changeListener($event): void {

    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    console.log('imprimiendo file', file);
    this.mensaje = undefined;

    if (this.formatosImg.indexOf(file.type.replace('image/', '').toLowerCase()) === -1) {
      this.usuario.imagen64 = null;
      this.mensaje = 'Formato inválido. Puede subir imagenes jpg, jpeg o png';
      this.imagen = null;
      return;
    } else if (file.size >= 50000) {
      this.usuario.imagen64 = null;
      this.mensaje = 'Archivo muy pesado. Puede subir imagenes de hasta 50 Kb';
      this.imagen = null;
      return;
    }

    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imagen = myReader.result;
      console.log('imprimiendo imagen', this.imagen);
    };

    myReader.readAsDataURL(file);
  }

  eliminarArchivo() {
    this.imagen = null;
  }
  //#endregion --------------------------------------------------------------------------







}
