import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {category} from '../../models/category';
import {CategoryService} from '../../services/category.service';
import {UserService} from '../../services/user.service';
import {PostService} from '../../services/post.service';
import {global} from '../../services/global';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {
  public page_title: string;
  public category: category;
  public posts: any;
  public url: string;
  public identity:any;
  public token:any;

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _categoryService: CategoryService,
      private _userService: UserService,
      private _postservice: PostService,
    ){

      this.url=global.url;
      this.posts='';
      this.page_title='Esto es una prueba';
      this.category= new category (1,'');
      this.identity= this._userService.getIdentity();
      this.token = this._userService.getToken();

  }

  ngOnInit(){
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    //sacamos el id del link
    this._route.params.subscribe(
        params=>{
            let id=+params['id'];
        
        this._categoryService.getCategory(id).subscribe(
            response=>{
                if(response.status == 'success'){
                  this.category = response.category;
                  this._categoryService.getPost(id).subscribe(
                      response=>{
                          if(response.status == 'success'){
                              this.posts=response.post;
                          }else{
                              this._router.navigate(['/inicio']);
                          }
                      },
                      error=>{
                        console.log(error);
                      }
                    );
                }
                else{
                  this._router.navigate(['/inicio']);
                }
            },error=>{}
          );
     } );
  }

  deletePost(id: any){

    this._postservice.delete(this.token,id).subscribe(
        response=>{
          this.getPostsByCategory();
        },error=>{
          console.log(error);
        }
      );

  }

}
