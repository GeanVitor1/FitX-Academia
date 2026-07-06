import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, AulaDto, CreateAulaDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AulasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/aulas`;

  getAll(): Observable<ResponseDto<AulaDto[]>> {
    return this.http.get<ResponseDto<AulaDto[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ResponseDto<AulaDto>> {
    return this.http.get<ResponseDto<AulaDto>>(`${this.apiUrl}/${id}`);
  }

  getByProfessorId(professorId: string): Observable<ResponseDto<AulaDto[]>> {
    return this.http.get<ResponseDto<AulaDto[]>>(`${this.apiUrl}/professor/${professorId}`);
  }

  create(dto: CreateAulaDto): Observable<ResponseDto<AulaDto>> {
    return this.http.post<ResponseDto<AulaDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: CreateAulaDto): Observable<ResponseDto<AulaDto>> {
    return this.http.put<ResponseDto<AulaDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
