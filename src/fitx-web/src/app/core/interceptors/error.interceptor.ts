import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { SKIP_ERROR_TOAST } from '../http/http-context.tokens';

let isRefreshing = false;
let refreshSubject: Subject<boolean> | null = null;

function extractErrorMessage(error: HttpErrorResponse): string {
  const body = error.error;

  if (typeof body === 'string' && body.trim()) {
    return body.trim();
  }

  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message.trim();
    }
    if (typeof body.error === 'string' && body.error.trim()) {
      return body.error.trim();
    }
    if (typeof body.title === 'string' && body.title.trim()) {
      return body.title.trim();
    }
    if (Array.isArray(body.errors) && body.errors.length) {
      const first = body.errors[0];
      if (typeof first === 'string') return first;
      if (first?.message) return String(first.message);
    }
    if (body.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)) {
      const values = Object.values(body.errors).flat();
      const first = values.find(v => typeof v === 'string' || (Array.isArray(v) && v[0]));
      if (typeof first === 'string') return first;
      if (Array.isArray(first) && first[0]) return String(first[0]);
    }
  }

  switch (error.status) {
    case 0:
      return 'Sem conexão com o servidor. Verifique sua internet.';
    case 400:
      return 'Requisição inválida. Verifique os dados e tente novamente.';
    case 401:
      return 'Sessão expirada. Faça login novamente.';
    case 403:
      return 'Você não tem permissão para esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return 'Conflito ao processar a solicitação.';
    case 422:
      return 'Dados inválidos. Verifique o formulário.';
    case 429:
      return 'Muitas tentativas. Aguarde um momento e tente de novo.';
    default:
      if (error.status >= 500) {
        return 'Erro interno do servidor. Tente novamente em instantes.';
      }
      return error.message || 'Ocorreu um erro inesperado.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);
  const skipToast = req.context.get(SKIP_ERROR_TOAST);

  return next(req).pipe(
    catchError(error => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        if (req.url.includes('/auth/refresh')) {
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject = new Subject<boolean>();

          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              const newToken = authService.getToken();
              refreshSubject!.next(true);
              refreshSubject!.complete();

              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(cloned);
            }),
            catchError(refreshError => {
              isRefreshing = false;
              refreshSubject!.next(false);
              refreshSubject!.complete();

              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              if (!skipToast) {
                toast.error('Sessão expirada. Faça login novamente.');
              }
              window.location.href = '/auth/login';
              return throwError(() => refreshError);
            })
          );
        }

        return refreshSubject!.pipe(
          switchMap(success => {
            if (success) {
              const newToken = authService.getToken();
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(cloned);
            }
            return throwError(() => error);
          })
        );
      }

      if (!skipToast && error.status !== 401) {
        toast.error(extractErrorMessage(error));
      }

      return throwError(() => error);
    })
  );
};
