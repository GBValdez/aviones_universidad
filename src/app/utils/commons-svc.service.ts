import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

// Servicio generico para la gestión de entidades
@Injectable({
  providedIn: 'root',
})
export class CommonsSvcService<dto, dtoCreation> {
  protected urlBase: string = '';
  constructor(protected http: HttpClient) {}
  // Creacion de la url base para el consumo de los servicios
  set url(url: string) {
    this.urlBase = `${environment.api}/${url}`;
  }
  get(): Observable<dto[]> {
    return this.http.get<dto[]>(this.urlBase);
  }
  getById(id: number): Observable<dto> {
    return this.http.get<dto>(`${this.urlBase}/${id}`);
  }
  post(body: dtoCreation): Observable<dto> {
    return this.http.post<dto>(this.urlBase, body);
  }
  put(id: number, body: dtoCreation): Observable<dto> {
    return this.http.put<dto>(`${this.urlBase}/${id}`, body);
  }
  delete(id: number): Observable<dto> {
    return this.http.delete<dto>(`${this.urlBase}/${id}`);
  }
}
