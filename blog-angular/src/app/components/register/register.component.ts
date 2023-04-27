import { Component, OnInit } from '@angular/core';
import {user} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public page_title: string;
  public user: user;
  public status: string;

  constructor(
      private _userService: UserService
    ){
    this.page_title = 'Registrate';
    this.user = new user(1,'','','ROLE_USER','','','','');
    this.status='';
  }
  ngOnInit(){
    console.log('componente de registro lanzado !!');
    console.log(this._userService.test());
  }
  onSubmit(form: any){
    //llamo la funcion register del servicio y envio el usuario y recibo los posibles errores
    this._userService.register(this.user).subscribe(
        response => {
          if(response.status == "success"){
            this.status=response.status;
            form.resetForm();
          }else {
            this.status="error";
          }
          console.log(response);
          
        },
        error => {
          this.status="error";
          console.log(<any>error);

        }

      );
    
  }

}
