import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import {CategoryService} from './services/category.service';
import {global} from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'blog-angular';
  public identity:any;
  public token:any;
  public url:any;
  public categories:any;

  constructor(
      private _userService: UserService,
      private _categoryService: CategoryService
    ){
      this.loadUser();
      this.url=global.url;
  }

  ngOnInit(){
      console.log("se cargo correctamente la paginaa!! ");
      this.getCategories();
  }

  ngDoCheck(){
      this.loadUser();
  }

  loadUser(){
      this.identity= this._userService.getIdentity();
      this.token=this._userService.getToken();
  }
  /*
  Creo una funcion loaduser para consultar constantement si hay un token y un usuario
  ngOnInit se ejecuta al inicio de la pagina, es decir al entrar
  ngDoCheck se ejecuta cada cierto tiempo
  */
  getCategories(){
    this._categoryService.getCategories().subscribe(
        response =>{
            if(response.status == 'success'){
              this.categories = response.categories;
              //console.log(this.categories);
            }
        },
        error => {
            console.log(<any>error);
        }
      );
  }

}
