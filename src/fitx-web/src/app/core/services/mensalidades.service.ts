import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, MensalidadeDto, CreateMensalidadeDto, PagamentoDto, CreatePagamentoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MensalidadesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mensalidades`;

  getByAlunoId(alunoId: string): Observable<ResponseDto<MensalidadeDto[]>> {
    return this.http.get<ResponseDto<MensalidadeDto[]>>(`${this.apiUrl}/aluno/${alunoId}`);
  }

  getById(id: string): Observable<ResponseDto<MensalidadeDto>> {
    return this.http.get<ResponseDto<MensalidadeDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateMensalidadeDto): Observable<ResponseDto<MensalidadeDto>> {
    return this.http.post<ResponseDto<MensalidadeDto>>(this.apiUrl, dto);
  }

  registrarPagamento(dto: CreatePagamentoDto): Observable<ResponseDto<PagamentoDto>> {
    return this.http.post<ResponseDto<PagamentoDto>>(`${this.apiUrl}/pagamento`, dto);
  }
}
