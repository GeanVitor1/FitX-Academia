import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, PlanoDto, CreatePlanoDto, UpdatePlanoDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PlanosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/planos`;

  getAll(): Observable<ResponseDto<PlanoDto[]>> {
    return this.http.get<ResponseDto<PlanoDto[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ResponseDto<PlanoDto>> {
    return this.http.get<ResponseDto<PlanoDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreatePlanoDto): Observable<ResponseDto<PlanoDto>> {
    return this.http.post<ResponseDto<PlanoDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdatePlanoDto): Observable<ResponseDto<PlanoDto>> {
    return this.http.put<ResponseDto<PlanoDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
