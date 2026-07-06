import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, CheckinDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CheckinsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/checkins`;

  checkin(alunoId: string): Observable<ResponseDto<CheckinDto>> {
    return this.http.post<ResponseDto<CheckinDto>>(`${this.apiUrl}/checkin/${alunoId}`, {});
  }

  checkout(alunoId: string): Observable<ResponseDto<CheckinDto>> {
    return this.http.post<ResponseDto<CheckinDto>>(`${this.apiUrl}/checkout/${alunoId}`, {});
  }

  getActive(): Observable<ResponseDto<CheckinDto[]>> {
    return this.http.get<ResponseDto<CheckinDto[]>>(`${this.apiUrl}/active`);
  }

  getByAlunoId(alunoId: string): Observable<ResponseDto<CheckinDto[]>> {
    return this.http.get<ResponseDto<CheckinDto[]>>(`${this.apiUrl}/aluno/${alunoId}`);
  }
}
