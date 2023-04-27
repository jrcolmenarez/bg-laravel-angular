import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {post} from '../../models/post';
import {PostService} from '../../services/post.service';
//import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit{
  public post:any;
 // public identity:any;

  constructor(
      private _postservice: PostService,
      private _route: ActivatedRoute,
      private _router: Router,
      //private _userService: UserService
    ){
      this.post ='';
     // this._userService.getIdentity();
  }

  ngOnInit(){

    this.getPost();

  }

  getPost(){

    //Sacar el id del post de la url
    this._route.params.subscribe(

      params =>{
          let id = +params['id'];
          //console.log(id);
          //peticion ajax para sacar los datos
          this._postservice.getPostDetail(id).subscribe(

                response =>{
                    if (response.status == 'success'){
                        this.post = response.post;
                        //console.log(this.post);
                    }else{
                        this._router.navigate(['inicio']); 
                    }
                },error=>{
                    console.log(error);
                    this._router.navigate(['inicio']); 
                }

            );
      });



  }

}
