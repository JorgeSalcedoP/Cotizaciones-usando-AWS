export class Resume {
    IdTra_Quotation     : Number;
    Serie_Quotation     : string;
    Area_Quotation      : string;
    Date_Quotation      : Date;
    Title_Quotation     : string;
    Service_Id          : Number;
    Company_Id          : Number;
    Client_Id           : Number;
    User_Id             : Number;
    Status_Quotation    : string;
    Document_Quotation  : string;
    Update_Quotation    : Date;
    Validez_Quotation   : Number;
    Total_Quotation     : Number;
    body                : Body [] = [];

    constructor(){
        this.body.push(new Body());
        this.Service_Id = 0;
    }
}

export class Body {
    IdCuerp_Cuerp       : Number;
    Item_Cuerp          : Number;
    Description_Cuerp   : string;
    Observation_Cuerp   : string;
    Brand_Cuerp         : string
    Quantity_Cuerp      : Number;
    PartNumber_Cuerp    : string;
    Unity_Cuerp         : Number;
    PUnitary_Cuerp      : Number;
    PSubtotal_Cuerp     : Number;
}

