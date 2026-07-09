import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto, RelatorioFinanceiroDto } from '../models/models';

export type { RelatorioFinanceiroDto };

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/relatorios`;

  getFinanceiro(inicio?: string, fim?: string): Observable<ResponseDto<RelatorioFinanceiroDto>> {
    const params = new URLSearchParams();
    if (inicio) params.set('inicio', inicio);
    if (fim) params.set('fim', fim);
    const query = params.toString();
    return this.http.get<ResponseDto<RelatorioFinanceiroDto>>(
      `${this.apiUrl}/financeiro${query ? `?${query}` : ''}`
    );
  }
}
