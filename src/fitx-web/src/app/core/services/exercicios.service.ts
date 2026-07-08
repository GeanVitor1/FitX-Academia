import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, ExercicioDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ExerciciosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/exercicios`;

  getAll(): Observable<ResponseDto<ExercicioDto[]>> {
    return this.http.get<ResponseDto<ExercicioDto[]>>(this.apiUrl);
  }
}
