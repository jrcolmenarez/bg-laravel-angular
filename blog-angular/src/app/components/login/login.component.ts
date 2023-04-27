import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {user} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title:string;
  public user: user;
  public status: string;
  public token: string;
  public identity: string;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
    ){
    this.page_title = 'Indentificate';
    this.user = new user(1,'','','ROLE_USER','','','','');
    this.status='';
    this.token='';
    this.identity='';
  }

  ngOnInit(){
    //se ejecuta siempre pero se cierra cuando llega el uno por la url
    this.logout();
  }
  onSubmit(form: any){
      this._userService.signup(this.user).subscribe(
            response => {
              //DEVUELVE TOKKEN
              if(response.status != 'error'){
                    this.status = 'success';
                    this.token = response;

                    //aqui saco el objeto, los datos del usuario
                    this._userService.signup(this.user, true).subscribe(
                          response => {
                            //DEVUELVE TOKKEN
                                  this.identity = response;

                                  //PERSISTIR DATOS USUARIO, GUARDANDO PARA GUARDAR SESION
                                  //console.log(this.token);
                                  console.log(this.identity); 
                                  localStorage.setItem('token', this.token);
                                  localStorage.setItem('identity', JSON.stringify(this.identity)); 
                                  //REDIRECCIONAN A INICIO
                                  this._router.navigate(['inicio']); 

                          },
                          error => {
                            this.status='error';
                              console.log(<any>error);
                          }
                      );                    

              }else{
                    this.status='error';
                    console.log(this.status);
              }


            },
            error => {
                this.status='error';
                console.log(<any>error);
            }
        );
  }
  logout(){
    this._route.params.subscribe(params => {
        let logout = +params['sure'];

        if(logout == 1){
          localStorage.removeItem('identity');
          localStorage.removeItem('token');

          this.identity = '';
          this.token = '';

          //REDIRECCIONAN A INICIO
          this._router.navigate(['inicio']);

        }
    });
  }


}
