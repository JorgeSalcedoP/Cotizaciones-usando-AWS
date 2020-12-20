import { Injectable } from '@angular/core'

@Injectable()
export class UserModel {
    IdMa_User?: Number;
    Name_User?: string;
    Email_User:string;
    Password_User:string;
    Employee_Id?:Number;
    Roles_Id?:Number;
    Status_User?:string;
    Creation_User?:Date;
    Updated_User?:Date;
}