import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Serie} from "../common/serie";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SerieService {
  baseURL = 'http://localhost:3678/api/series';
  constructor(private http: HttpClient) { }

  getSerieList(): Observable<Serie[]> {
    return this.http.get<Serie[]>(this.baseURL+"/");
  }

  getSerie(id : string): Observable<Serie> {
    return this.http.get<Serie>(this.baseURL+"/serie/"+id);
  }

  updateSerie(id: string, serie: Serie) {
    return this.http.put(this.baseURL+"/"+id, serie);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.baseURL+'/categories');
  }

  createSerie(serie: Serie) {
    return this.http.post(this.baseURL, serie);
  }

  removeSerie(id: string) {
    return this.http.delete(this.baseURL+'/'+id);
  }
}
