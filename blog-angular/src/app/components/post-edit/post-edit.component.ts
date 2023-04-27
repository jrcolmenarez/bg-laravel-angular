import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CategoryService} from '../../services/category.service';
import {PostService} from '../../services/post.service';
import {post} from '../../models/post';
import {global} from '../../services/global';

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit{

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
    this.page_title= 'Editar una Entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post='';
    this.categories='';
    this.url=global.url;
    this.status='';
    this.is_edit=true;
  }

  ngOnInit(){
    this.getCategories();
    this.post = new post(1, this.identity.id,1,'','','','');
    this.getPost();
  }

  onSubmit(form:any){
    this._postservice.update(this.token, this.post, this.post.id).subscribe(
         response=>{
          if (response.status=='success'){
            this.status = 'success';
            this._router.navigate(['entrada', this.post.id]);
          }else {
            this.status='error'
          }
      },error=>{
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

    getPost(){

    //Sacar el id del post de la url
    this._route.params.subscribe(

      params =>{
          let id = +params['id'];
          console.log(id);
          //peticion ajax para sacar los datos
          this._postservice.getPostDetail(id).subscribe(

                response =>{
                    if (response.status == 'success'){
                        this.post = response.post;
                        //verificar si pertener el post al usuario
                        if(this.post.user_id != this.identity.sub){
                            this._router.navigate(['inicio']);   
                        }
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
