import { Component, OnInit } from '@angular/core';
import { QuotationModel } from 'src/app/models/Quotation.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/services/permission.service';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quotation-edit',
  templateUrl: './quotation-edit.component.html',
  styleUrls: ['./quotation-edit.component.css']
})
export class QuotationEditComponent implements OnInit {

  selectedFiles: FileList;
  readers: string | ArrayBuffer;
  forma: FormGroup;

  quotation: QuotationModel = {
    IdTra_Quotation: 0,
    Area_Quotation: '',
    Serie_Quotation: '',
    Date_Quotation: new Date(),
    Service_Id: 0,
    Company_Id: 0,
    Client_Id: 0,
    Status_Quotation: '',
    Document_Quotation: '',
    Update_Quotation: new Date(),
    Validez_Quotation: 0,
    Total_Quotation: 0,
    SRestante_Quotation: 0
  }

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private permissionService: PermissionService, private authenticatedService: AuthenticatedService, private quotationService: QuotationService) {
    this.forma = new FormGroup({
      Serie_Quotation: new FormControl('', [Validators.required]),
      Document_Quotation: new FormControl(''),
      Status_Quotation: new FormControl('', [Validators.required]),
      File_Osce: new FormControl(''),
      Validez_Quotation: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    const param = this.activatedRoute.snapshot.params;
    if (param.id != "nuevo") {
      this.quotationService.getQuotation(param.id).subscribe(
        res => {
          this.quotation = res[0];
        },
        err => console.error(err)
      );
    }
  }

  updateQuotation() {
    if (this.quotation.Document_Quotation === '' || this.quotation.Document_Quotation === null) {
      const file = this.selectedFiles.item(0);
      console.log(file);
      var data = {
        file: this.readers,
        name: file.name,
        type: file.type,
        folder: "cotizacion"
      }
      this.quotationService.postFile(data).subscribe(
        res => {
          console.log(res);
            var string = JSON.stringify(res);
            var json = JSON.parse(string);
            this.quotation.Document_Quotation = json.Location;
            this.quotationService.createOrUpdateQuotation(this.quotation).subscribe(
              res => {
                var string = JSON.stringify(res);
                var json = JSON.parse(string);
                if(json.affectedRows>0){
                  Swal.fire({
                    title: 'Success',
                    text: `La Cotización  ${this.quotation.Serie_Quotation} fue actualizada`,
                    icon: 'success'
                  });
                  this.router.navigate(['/quotations']);
                } else {
                  Swal.fire({
                    title: 'Error',
                    text: `Algo salio mal, La Cotización no fue actualizada..!!`,
                    icon: 'error'
                  });
                }
              },
              err => console.error(err)
            );
        },
        err => console.error(err)
      );
    } else {
      this.quotationService.createOrUpdateQuotation(this.quotation).subscribe(
        res => {
          var string = JSON.stringify(res);
            var json = JSON.parse(string);
            if(json.affectedRows>0){
            Swal.fire({
              title: 'Success',
              text: `La Cotización  ${this.quotation.Serie_Quotation} fue agregada`,
              icon: 'success'
            });
            this.router.navigate(['/quotations']);
          } else {
            Swal.fire({
              title: 'Error',
              text: `Algo salio mal, La Cotización no fue agregada..!!`,
              icon: 'error'
            });
          }
        },
        err => console.error(err)
      );
    }
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    const file1 = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file1);
    reader.onload = () => {
      this.readers = reader.result;
    };
  }

}
