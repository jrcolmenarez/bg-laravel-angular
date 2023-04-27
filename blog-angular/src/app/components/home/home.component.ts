import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {UserService} from '../../services/user.service';
import {post} from '../../models/post';
import {global} from '../../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService, UserService]
})
export class HomeComponent implements OnInit {

  public page_title: string;
  public url:any;
  public posts: Array<post>;
  public identity:any;
  public token:any;

  constructor(
      private _postservice: PostService,
      private _userService: UserService
    ){
    this.page_title='inicio';
    this.url = global.url;
    this.posts = new Array<post>();
    this.identity= this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(){
    this.getposts();
  }

  getposts(){
    this._postservice.getPosts().subscribe(
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
          this.getposts();
        },error=>{
          console.log(error);
        }
      );

  }


}
