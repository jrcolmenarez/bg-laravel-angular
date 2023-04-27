import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {category} from '../models/category';
import {global} from './global';

@Injectable()
export class CategoryService {
	public url: any;

	constructor(
			private _http: HttpClient
		){
			this.url = global.url;
	}

	create(token:any, category:category): Observable<any>{
		let json = JSON.stringify(category);//convierto en json el modelo
		let params = "json="+json;

		let headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded')
										.set('Authorization', token);
		return this._http.post(this.url+'category',params,{headers:headers});
	}

	getCategories(): Observable<any>{
		let headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
		return this._http.get(this.url+'category',{headers:headers});
	}

	getCategory(id:any): Observable<any>{
		let headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
		return this._http.get(this.url+'category/'+id,{headers:headers});
	}

	getPost(id:any): Observable<any>{
		let headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
		return this._http.get(this.url+'post/category/'+id,{headers:headers});
	}
}