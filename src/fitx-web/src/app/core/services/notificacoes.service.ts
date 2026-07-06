import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, NotificacaoDto, CreateNotificacaoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class NotificacoesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notificacoes`;

  getAll(): Observable<ResponseDto<NotificacaoDto[]>> {
    return this.http.get<ResponseDto<NotificacaoDto[]>>(this.apiUrl);
  }

  getNaoLidas(): Observable<ResponseDto<NotificacaoDto[]>> {
    return this.http.get<ResponseDto<NotificacaoDto[]>>(`${this.apiUrl}/nao-lidas`);
  }

  countNaoLidas(): Observable<ResponseDto<number>> {
    return this.http.get<ResponseDto<number>>(`${this.apiUrl}/count-nao-lidas`);
  }

  create(dto: CreateNotificacaoDto): Observable<ResponseDto<NotificacaoDto>> {
    return this.http.post<ResponseDto<NotificacaoDto>>(this.apiUrl, dto);
  }

  marcarComoLida(id: string): Observable<ResponseDto<NotificacaoDto>> {
    return this.http.put<ResponseDto<NotificacaoDto>>(`${this.apiUrl}/${id}/lida`, {});
  }

  marcarTodasComoLida(): Observable<ResponseDto<void>> {
    return this.http.put<ResponseDto<void>>(`${this.apiUrl}/lidas`, {});
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
