import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  //recogo los datos enviado por HTML del padre
  @Input() posts: any;
  @Input() identity: any;
  @Input() url: any;
  @Output() delete = new EventEmitter();

  constructor(){

  }

  ngOnInit(){

  }
  deletePost(post_id:any){
    this.delete.emit(post_id);
  }


}
