import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {UserService} from '../../services/user.service';
import {post} from '../../models/post';
import {user} from '../../models/user';
import {global} from '../../services/global';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

  public url:any;
  public posts: Array<post>;
  public user: user;
  public identity:any;
  public token:any;

  constructor(
      private _postservice: PostService,
      private _userService: UserService,
      private _route: ActivatedRoute,
      private _router: Router
    ){

    this.url = global.url;
    this.posts = new Array<post>();
    this.user = new user(1,'','','','','','','');
    this.identity= this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(){
 
    this.getProfile();
  }
  getProfile(){
    //sacar el id del usuario
    this._route.params.subscribe(

      params =>{
          let userId = +params['id'];
          this.getposts(userId);
          this.getUser(userId);
    });
  }

  getUser(userId: any){
    this._userService.getUserDetail(userId).subscribe(
      response =>{
        if(response.status == 'success'){
          this.user = response.user;
          console.log(this.user);
        }
      },error=>{
        console.log(error);
      }
      );
  }

  getposts(userId: any){
    this._userService.getPostDetail(userId).subscribe(
      response =>{
        if(response.status == 'success'){
          this.posts = response.post;
          //console.log(this.posts);
        }
      },error=>{
        console.log(error);
      }
      );
  }

  deletePost(id: any){

    this._postservice.delete(this.token,id).subscribe(
        response=>{
          this.getProfile();
        },error=>{
          console.log(error);
        }
      );

  }


}
