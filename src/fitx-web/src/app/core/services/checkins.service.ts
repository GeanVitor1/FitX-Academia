import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, CheckinDto, CheckinRequestDto } from '../models/models';
import { SKIP_ERROR_TOAST } from '../http/http-context.tokens';

@Injectable({ providedIn: 'root' })
export class CheckinsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/checkins`;

  private silentContext(): HttpContext {
    return new HttpContext().set(SKIP_ERROR_TOAST, true);
  }

  checkin(alunoId: string): Observable<ResponseDto<CheckinDto>> {
    return this.http.post<ResponseDto<CheckinDto>>(`${this.apiUrl}/checkin/${alunoId}`, {});
  }

  checkout(alunoId: string): Observable<ResponseDto<CheckinDto>> {
    return this.http.post<ResponseDto<CheckinDto>>(`${this.apiUrl}/checkout/${alunoId}`, {});
  }

  getActive(options?: { silent?: boolean }): Observable<ResponseDto<CheckinDto[]>> {
    return this.http.get<ResponseDto<CheckinDto[]>>(`${this.apiUrl}/active`, {
      context: options?.silent ? this.silentContext() : undefined
    });
  }

  getByAlunoId(alunoId: string, options?: { silent?: boolean }): Observable<ResponseDto<CheckinDto[]>> {
    return this.http.get<ResponseDto<CheckinDto[]>>(`${this.apiUrl}/aluno/${alunoId}`, {
      context: options?.silent ? this.silentContext() : undefined
    });
  }

  createRequest(alunoId: string): Observable<ResponseDto<CheckinRequestDto>> {
    return this.http.post<ResponseDto<CheckinRequestDto>>(`${this.apiUrl}/request/${alunoId}`, {});
  }

  getPendingRequests(options?: { silent?: boolean }): Observable<ResponseDto<CheckinRequestDto[]>> {
    return this.http.get<ResponseDto<CheckinRequestDto[]>>(`${this.apiUrl}/requests/pending`, {
      context: options?.silent ? this.silentContext() : undefined
    });
  }

  getRequestsByAlunoId(alunoId: string, options?: { silent?: boolean }): Observable<ResponseDto<CheckinRequestDto[]>> {
    return this.http.get<ResponseDto<CheckinRequestDto[]>>(`${this.apiUrl}/requests/aluno/${alunoId}`, {
      context: options?.silent ? this.silentContext() : undefined
    });
  }

  approveRequest(requestId: string, staffUserId: string): Observable<ResponseDto<CheckinRequestDto>> {
    return this.http.post<ResponseDto<CheckinRequestDto>>(`${this.apiUrl}/requests/${requestId}/approve`, { staffUserId });
  }

  denyRequest(requestId: string, staffUserId: string): Observable<ResponseDto<CheckinRequestDto>> {
    return this.http.post<ResponseDto<CheckinRequestDto>>(`${this.apiUrl}/requests/${requestId}/deny`, { staffUserId });
  }

  cancelRequest(requestId: string, alunoId: string): Observable<ResponseDto<CheckinRequestDto>> {
    return this.http.post<ResponseDto<CheckinRequestDto>>(`${this.apiUrl}/requests/${requestId}/cancel`, { alunoId });
  }
}
