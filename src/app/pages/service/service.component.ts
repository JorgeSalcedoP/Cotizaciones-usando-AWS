import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ServiceModel } from '../../models/service.model';
import { ServiceService } from '../../services/service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  forma: FormGroup;

  edit: boolean = false;

  service: ServiceModel = {
    IdMa_Service: 0,
    Description_Service: '',
    Types_Service: '',
    Creation_Service: new Date(),
    Update_Service: new Date(),
    Status_Service: true
  };

  constructor(private serviceService: ServiceService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.forma = new FormGroup({
      Description_Service: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú ]+$')]),
      Types_Service: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    const param = this.activatedRoute.snapshot.params;
    if (param.id != "nuevo") {
      this.serviceService.getService(param.id).subscribe(
        res => {
          this.service = res[0];
          this.edit = true;
        },
        err => console.error(err)
      );
    }
  }

  createService() {

    this.serviceService.createOrUpdateService(this.service).subscribe(
      res => {
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        if (json.affectedRows > 0) {
          Swal.fire({
            title: 'Success',
            text: `El Servicio ${this.service.Description_Service} fue agregado`,
            icon: 'success'
          });
          this.router.navigate(['/services']);
        } else {
          Swal.fire({
            title: 'Error',
            text: `Algo salio mal, El servicio no fue agregado..!!`,
            icon: 'error'
          });
        }
      },
      err => console.error(err)
    );
  }

  updateService() {
    this.service.Status_Service = true;
    this.serviceService.createOrUpdateService(this.service).subscribe(
      res => {
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        if (json.affectedRows > 0) {
          Swal.fire({
            title: 'Success',
            text: `El Servicio ${this.service.Description_Service} fue actualizado`,
            icon: 'success'
          });
          this.router.navigate(['/services']);
        }
      },
      err => console.error(err)
    );
  }

}