export interface BillModel{
    IdMa_Bill?:Number;
    Serie_Bill:string;
    Total_Bill:Number;
    Document_Bill:string;
    Quotation_Serie:string;
    Osce_Serie:string;
    Creation_Bill?:Date;
    Update_Bill?:Date;
    Status_Bill?:string;
    Moneda_Bill:string;
    Company_Id:Number;
    Service_Description?:string;
}