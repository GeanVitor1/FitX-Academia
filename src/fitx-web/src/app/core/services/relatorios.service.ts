import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto } from '../models/models';

export interface RelatorioFinanceiroDto {
  receitaTotal: number;
  receitaMensal: number;
  totalPagamentos: number;
  pagamentosPendentes: number;
  receitaPorMes: { mes: string; valor: number }[];
  planosMaisVendidos: { planoNome: string; totalMatriculas: number; receita: number }[];
}

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/relatorios`;

  getFinanceiro(inicio?: string, fim?: string): Observable<ResponseDto<RelatorioFinanceiroDto>> {
    const params = new URLSearchParams();
    if (inicio) params.set('inicio', inicio);
    if (fim) params.set('fim', fim);
    return this.http.get<ResponseDto<RelatorioFinanceiroDto>>(`${this.apiUrl}/financeiro?${params}`);
  }

  getAlunos(): Observable<ResponseDto<any>> {
    return this.http.get<ResponseDto<any>>(`${this.apiUrl}/alunos`);
  }

  getPagamentos(): Observable<ResponseDto<any>> {
    return this.http.get<ResponseDto<any>>(`${this.apiUrl}/pagamentos`);
  }
}
