import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, ProfessorDto, CreateProfessorDto, UpdateProfessorDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProfessoresService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/professores`;

  getAll(): Observable<ResponseDto<ProfessorDto[]>> {
    return this.http.get<ResponseDto<ProfessorDto[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ResponseDto<ProfessorDto>> {
    return this.http.get<ResponseDto<ProfessorDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateProfessorDto): Observable<ResponseDto<ProfessorDto>> {
    return this.http.post<ResponseDto<ProfessorDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProfessorDto): Observable<ResponseDto<ProfessorDto>> {
    return this.http.put<ResponseDto<ProfessorDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
