import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, AlunoDto, CreateAlunoDto, UpdateAlunoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AlunosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/alunos`;

  getAll(): Observable<ResponseDto<AlunoDto[]>> {
    return this.http.get<ResponseDto<AlunoDto[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ResponseDto<AlunoDto>> {
    return this.http.get<ResponseDto<AlunoDto>>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(usuarioId: string): Observable<ResponseDto<AlunoDto>> {
    return this.http.get<ResponseDto<AlunoDto>>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  create(dto: CreateAlunoDto): Observable<ResponseDto<AlunoDto>> {
    return this.http.post<ResponseDto<AlunoDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAlunoDto): Observable<ResponseDto<AlunoDto>> {
    return this.http.put<ResponseDto<AlunoDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
