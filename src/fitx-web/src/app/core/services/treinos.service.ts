import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, TreinoDto, CreateTreinoDto, UpdateTreinoDto, SerieDto, CreateSerieDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TreinosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/treinos`;

  getByAlunoId(alunoId: string): Observable<ResponseDto<TreinoDto[]>> {
    return this.http.get<ResponseDto<TreinoDto[]>>(`${this.apiUrl}/aluno/${alunoId}`);
  }

  getAll(): Observable<ResponseDto<TreinoDto[]>> {
    return this.http.get<ResponseDto<TreinoDto[]>>(this.apiUrl);
  }

  getByProfessorId(professorId: string): Observable<ResponseDto<TreinoDto[]>> {
    return this.http.get<ResponseDto<TreinoDto[]>>(`${this.apiUrl}/professor/${professorId}`);
  }

  getById(id: string): Observable<ResponseDto<TreinoDto>> {
    return this.http.get<ResponseDto<TreinoDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTreinoDto): Observable<ResponseDto<TreinoDto>> {
    return this.http.post<ResponseDto<TreinoDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateTreinoDto): Observable<ResponseDto<TreinoDto>> {
    return this.http.put<ResponseDto<TreinoDto>>(`${this.apiUrl}/${id}`, dto);
  }

  addSeries(treinoId: string, dto: CreateSerieDto): Observable<ResponseDto<SerieDto>> {
    return this.http.post<ResponseDto<SerieDto>>(`${this.apiUrl}/${treinoId}/series`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
