import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, AgendamentoDto, CreateAgendamentoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AgendamentosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;

  getByAlunoId(alunoId: string): Observable<ResponseDto<AgendamentoDto[]>> {
    return this.http.get<ResponseDto<AgendamentoDto[]>>(`${this.apiUrl}/aluno/${alunoId}`);
  }

  getByAulaId(aulaId: string): Observable<ResponseDto<AgendamentoDto[]>> {
    return this.http.get<ResponseDto<AgendamentoDto[]>>(`${this.apiUrl}/aula/${aulaId}`);
  }

  getByData(data: string): Observable<ResponseDto<AgendamentoDto[]>> {
    return this.http.get<ResponseDto<AgendamentoDto[]>>(`${this.apiUrl}/data/${data}`);
  }

  getById(id: string): Observable<ResponseDto<AgendamentoDto>> {
    return this.http.get<ResponseDto<AgendamentoDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateAgendamentoDto): Observable<ResponseDto<AgendamentoDto>> {
    return this.http.post<ResponseDto<AgendamentoDto>>(this.apiUrl, dto);
  }

  cancelar(id: string): Observable<ResponseDto<AgendamentoDto>> {
    return this.http.put<ResponseDto<AgendamentoDto>>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
