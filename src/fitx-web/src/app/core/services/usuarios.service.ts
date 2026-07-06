import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, UsuarioDto, UpdateUsuarioDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getAll(): Observable<ResponseDto<UsuarioDto[]>> {
    return this.http.get<ResponseDto<UsuarioDto[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ResponseDto<UsuarioDto>> {
    return this.http.get<ResponseDto<UsuarioDto>>(`${this.apiUrl}/${id}`);
  }

  update(id: string, dto: UpdateUsuarioDto): Observable<ResponseDto<UsuarioDto>> {
    return this.http.put<ResponseDto<UsuarioDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
