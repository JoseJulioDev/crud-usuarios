import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly API = "api/usuarios";

  constructor(private httpClient: HttpClient) { }

  findAll() {
    return this.httpClient.get<Usuario[]>(this.API);
  }

  findById(id: String) {
    return this.httpClient.get<Usuario>(`${this.API}/${id}`);
  }

  save(usuario: Partial<Usuario>) {
    if (usuario.id) {
      return this.update(usuario);
    } else {
      return this.create(usuario)
    }
  }

  private create(usuario: Partial<Usuario>) {
    return this.httpClient.post<Usuario>(this.API, usuario);
  }

  private update(usuario: Partial<Usuario>) {
    return this.httpClient.put<Usuario>(`${this.API}/${usuario.id}`, usuario);
  }

  delete(id: string) {
    return this.httpClient.delete<Usuario>(`${this.API}/${id}`);
  }
}
