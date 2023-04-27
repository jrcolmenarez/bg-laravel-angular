import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {user} from '../models/user';
import {global} from './global';

@Injectable()
export class UserService {
	public url: any;
	public identity:any;
	public token:any;

	constructor(
			public _http: HttpClient
		){
			this.url = global.url;
	}

	test(){
		return "Hola Mundo desde un servicio!!";
	}

	register(user: any): Observable<any>{
		//limpiar el campo user.description que contenga solo string
		user.description = global.htmlEntities(user.description);

		let json = JSON.stringify(user);//convertimos en string y guardamos en json
		let params = 'json='+json; //creamos la variable json y la completamos con json
		//console.log(params);
		let headers = new HttpHeaders().set('content-type','application/x-www-form-urlencoded');

		return this._http.post(this.url+'register',params,{headers: headers});//completo el url
	}


	  signup(user:any, gettoken:any = null): Observable<any>{

      if (gettoken != null){
          user.gettoken = 'true';
      }

      let json = JSON.stringify(user);
      let params = 'json='+json;
      //console.log(params);
      //cabeceras para hacer la peticion por ajax, en el return
      let headers = new HttpHeaders().set('content-type','application/x-www-form-urlencoded');
      return this._http.post(this.url+'login',params,{headers: headers});
  }
  	update(token:any, user:user): Observable<any>{
			//limpiar el campo user.description que contenga solo string
			user.description = global.htmlEntities(user.description);

  		let json = JSON.stringify(user);//convierto en json el usuario
  		let params = "json="+json;//concateno nombre var json para enviar URL
  		let headers = new HttpHeaders().set('content-type','application/x-www-form-urlencoded')
  																		.set('Authorization', token);//completo la cabecera con authorization
  		return this._http.put(this.url+'user/update', params, {headers: headers});

  	}

	  getIdentity(){

	  		/*let identity = JSON.stringify(localStorage.getItem('identity'));
	  		console.log(identity);
	  		if (identity && identity != "undefined"){
	  			this.identity = identity;
	  		}else{
	  			this.identity=null;
	  		}
	  		return this.identity;*/
			let identityString = localStorage.getItem('identity');
				  if(identityString !== null){
				    let identity = JSON.parse(identityString); // Parsea la cadena JSON
				    if(identity && typeof identity !== "undefined"){
				      this.identity = identity;
				    }else{
				      this.identity = null;
				    }
				  }else{
				    this.identity = null;
				  }
				  //console.log(this.identity);
				  return this.identity;

	  }

	  getToken(){
	  	let token = localStorage.getItem('token'); 

	  	if(token && token != "undefined"){
	  		this.token = token;
	  	}else{
	  		this.token = null;
	  	}
	  	return this.token;

	  }
	  getPostDetail(id: any):Observable<any>{
			let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
			return this._http.get(this.url+'post/user/'+id,{headers:headers});
	}

		  getUserDetail(id: any):Observable<any>{
			let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
			return this._http.get(this.url+'user/detail/'+id,{headers:headers});
	}

}