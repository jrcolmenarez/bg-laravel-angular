import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CategoryService} from '../../services/category.service';
import {PostService} from '../../services/post.service';
import {post} from '../../models/post';
import {global} from '../../services/global';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit{

  public page_title:string;
  public token: any;
  public identity: any;
  public post: any;
  public categories:any;
  public url:any;
  public status:any;
  public is_edit: boolean;
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
          url:global.url+'post/upload',
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
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserService,
      private _categoryService: CategoryService,
      private _postservice: PostService
    ){
    this.page_title= 'Crear una Entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post='';
    this.categories='';
    this.url=global.url;
    this.status='';
    this.is_edit=false;
  }

  ngOnInit(){
    this.getCategories();
    this.post = new post(1, this.identity.id,1,'','','','');
    //console.log(this.post);
  }

  onSubmit(form:any){
    //console.log(this.post);
    //console.log(this._postservice.pruebas());
    this._postservice.create(this.token,this.post).subscribe(
      response=>{
          if(response.status == 'success'){
              this.post = response.post;
              this.status = 'success';
              this._router.navigate(['inicio']);

          }else{
              this.status='error';
          }
      },error=>{
          console.log(error);
          this.status='error';
      }
      );
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
        response =>{
            if(response.status=='success'){
                this.categories=response.categories;
            }
        },
          error=>{
            console.log(error);
          }
      );
  }

  imageUpload(data: any){

        let image_data = data.body;
        //console.log(image_data);  
        this.post.image = image_data.image;       

  }

}
