import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, PagamentoDto, CreatePagamentoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PagamentosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pagamentos`;

  getAll(): Observable<ResponseDto<PagamentoDto[]>> {
    return this.http.get<ResponseDto<PagamentoDto[]>>(this.apiUrl);
  }

  getByMensalidadeId(mensalidadeId: string): Observable<ResponseDto<PagamentoDto[]>> {
    return this.http.get<ResponseDto<PagamentoDto[]>>(`${this.apiUrl}/mensalidade/${mensalidadeId}`);
  }

  getById(id: string): Observable<ResponseDto<PagamentoDto>> {
    return this.http.get<ResponseDto<PagamentoDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreatePagamentoDto): Observable<ResponseDto<PagamentoDto>> {
    return this.http.post<ResponseDto<PagamentoDto>>(this.apiUrl, dto);
  }
}
