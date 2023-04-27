import { Component, OnInit } from '@angular/core';
import { user } from '../../models/user';
import {UserService} from '../../services/user.service';
import { Uploader, UploadWidgetConfig, UploadWidgetResult } from 'uploader';
import {global} from '../../services/global';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent  implements OnInit {

    public page_title: string;
    public user: user;
    public identity:any;
    public token:any;
    public status:string;
    public url:any;
    public froala_option: Object = {
                          charCounterCount: true,
                          lenguage: 'es',
                          toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
                          toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
                          toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
                          toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
                        };
    public afuConfig = {
            multiple: false,
            formatsAllowed: ".jpg,.png, .gif, .jpeg",
            maxSize: 50,
            uploadAPI:  {
              url:global.url+'user/upload',
              headers: {
             "Authorization" : this._userService.getToken()
              },

            },
            theme: "attachPin",
            hideProgressBar: false,
            hideResetBtn: true,
            hideSelectBtn: false,
            replaceTexts: {
                          selectFileBtn: 'Select Files',
                          resetBtn: 'Reset',
                          uploadBtn: 'Upload',
                          dragNDropBox: 'Drag N Drop',
                          attachPinBtn: 'Sube tu Foto...',
                          afterUploadMsg_success: 'Successfully Uploaded !',
                          afterUploadMsg_error: 'Upload Failed !'
                        }
        };

    constructor(

        private _userService: UserService

      ){

        this.page_title="Ajustes de Usuario";
        this.user = new user(1,'','','ROLE_USER','','','','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.status='';
        //asiganmos los valores del objeto indentity a user
        this.user = new user(
            this.identity.sub,
            this.identity.name,
            this.identity.surname,
            this.identity.role,
            this.identity.email, '',
            this.identity.description,
            this.identity.image
          );
        this.url=global.url;
    
    }

    ngOnInit(){

    }

    onSubmit(form: any){
      this._userService.update(this.token, this.user).subscribe(
          response => {
            if(response){
              console.log(response);
                this.status=response.status;
                //console.log(this.status);
                //actualizamos los datos para la sesion
                //consulto en cada if si hubo cambio en cada uno de los campos
                this.identity = this.user; //traemos el usuario actualizado
                localStorage.setItem('identity', JSON.stringify(this.identity)); //actualizamos el local estorage para el nombre de usuario
            }else{
                this.status = 'error';
            }
          },
          error =>{
            this.status = 'error';
            console.log(<any>error);
          }
          );
    }

    avatarUpload(datos: any){

        let data_obj = datos.body;
        console.log(data_obj);  
        this.user.image = data_obj.image;
        //console.log(this.user);        

    }


}
