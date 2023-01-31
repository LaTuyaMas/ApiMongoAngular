import { Injectable } from '@angular/core';
import {Categorie} from "../common/categorie";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  baseURL = 'http://localhost:3678/api/categories';
  constructor(private http: HttpClient) { }

  getCategorieList(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseURL+"/");
  }
}
