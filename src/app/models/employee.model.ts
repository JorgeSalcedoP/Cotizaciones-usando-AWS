import { DatePipe } from '@angular/common';

export interface EmployeeModel{
    IdMa_Employee?: Number;
	Name_Employee:string;
	Lastname_Employee:string;
	Mobile_Employee:string;
	Email_Employee:string;
	Birthdate_Employee:Date;
	Area_Employee:string;
	Creation_Employee?:Date;
	Update_Employee?:Date;
	Status_Employee?:boolean;
}