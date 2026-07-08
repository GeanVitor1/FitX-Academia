import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto } from '../models/models';

export interface EquipamentoDto {
  id: string;
  nome: string;
  categoria: string;
  localizacao?: string;
  status: string;
  ultimaManutencao?: string;
  ativo: boolean;
}

export interface CreateEquipamentoDto {
  nome: string;
  categoria: string;
  localizacao?: string;
  ultimaManutencao?: string;
}

export interface UpdateEquipamentoDto {
  nome?: string;
  categoria?: string;
  localizacao?: string;
  status?: string;
  ultimaManutencao?: string;
}

@Injectable({ providedIn: 'root' })
export class EquipamentosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/equipamentos`;

  getAll(): Observable<ResponseDto<EquipamentoDto[]>> {
    return this.http.get<ResponseDto<EquipamentoDto[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ResponseDto<EquipamentoDto>> {
    return this.http.get<ResponseDto<EquipamentoDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateEquipamentoDto): Observable<ResponseDto<EquipamentoDto>> {
    return this.http.post<ResponseDto<EquipamentoDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateEquipamentoDto): Observable<ResponseDto<EquipamentoDto>> {
    return this.http.put<ResponseDto<EquipamentoDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ResponseDto<void>> {
    return this.http.delete<ResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}