import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  generateExcel(report) {
    const title = 'Reporte General';
    //Excel Title, Header, Data
    const header = ['AREA','ENCARGADO','FECHA','MES','CLIENTE','EMPRESA','N° COTIZACIÓN','ESTADO COTIZACIÓN','IMPORTE','SALDO RESTANTE','SERVICIO','TIPO DE TRABAJO','URL COTIZACIÓN','OC','N° OC','ESTADO OC','REGISTRO','MONEDA','IMPORTE SUBTOTAL','URL OC','URL DOCUMENTOS','FACTURA','N° FACTURA','ESTADO FACTURA','FECHA FACTURA','IMPORTE FACTURA','PAGADO','URL FACTURA']
    const data = report;
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('REPORTE ITGREEN');


    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.mergeCells(`A${titleRow.number}:AB${titleRow.number}`);
    titleRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DDEBF7' }
    };
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    
    worksheet.autoFilter = 'A2:AB2';

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4EC087' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      row.getCell(3).value=new Date(d[2]) ;
      row.getCell(17).value=new Date(d[16]);
      row.getCell(25).value=new Date(d[24]);
      if(d[12]!='' ){
        if(d[12]!=null){
          row.getCell(13).value = {
            text: d[6]+'-COTIZACIÓN PDF',
            hyperlink: d[12],
          }
        }
      }
      if(d[19]!='' ){
        if(d[19]!=null){
          row.getCell(20).value = {
            text: d[14]+'-OC PDF',
            hyperlink: d[19],
          }
        }
      }
      if(d[20]!='' ){
        if(d[20]!=null){
          row.getCell(21).value = {
            text: d[14]+'-DOCUMENTOS RAR',
            hyperlink: d[20],
          }
        }
      }
      if(d[27]!='' ){
        if(d[27]!=null){
          row.getCell(28).value = {
            text: d[22]+'-FACTURA PDF',
            hyperlink: d[27],
          }
        }
      }
    });

    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 45;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 50;
    worksheet.getColumn(14).width = 8;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 15;
    worksheet.getColumn(17).width = 15;
    worksheet.getColumn(18).width = 15;
    worksheet.getColumn(19).width = 15;
    worksheet.getColumn(20).width = 50;
    worksheet.getColumn(21).width = 50;
    worksheet.getColumn(22).width = 10;
    worksheet.getColumn(23).width = 35;
    worksheet.getColumn(24).width = 15;
    worksheet.getColumn(25).width = 15;
    worksheet.getColumn(26).width = 20;
    worksheet.getColumn(27).width = 10;
    worksheet.getColumn(28).width = 50;

    var name = 'ITGREEN_'+new Date().getTime()+'.xlsx';


    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name);
    })
  }
}