import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, AvaliacaoDto, CreateAvaliacaoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AvaliacoesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/avaliacoes`;

  getAll(): Observable<ResponseDto<AvaliacaoDto[]>> {
    return this.http.get<ResponseDto<AvaliacaoDto[]>>(this.apiUrl);
  }

  getByAlunoId(alunoId: string): Observable<ResponseDto<AvaliacaoDto[]>> {
    return this.http.get<ResponseDto<AvaliacaoDto[]>>(`${this.apiUrl}/aluno/${alunoId}`);
  }

  getById(id: string): Observable<ResponseDto<AvaliacaoDto>> {
    return this.http.get<ResponseDto<AvaliacaoDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateAvaliacaoDto): Observable<ResponseDto<AvaliacaoDto>> {
    return this.http.post<ResponseDto<AvaliacaoDto>>(this.apiUrl, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
