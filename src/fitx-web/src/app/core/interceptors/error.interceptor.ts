import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

let isRefreshing = false;
let refreshSubject: Subject<boolean> | null = null;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        if (req.url.includes('/auth/refresh') || req.url.includes('/auth/revoke')) {
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

      if (error.status === 403) {
        toast.error('Acesso negado');
      } else if (error.status === 400) {
        const message = error.error?.message || error.error?.error || error.error?.errors?.[0];
        if (message) {
          toast.error(message);
        }
      } else if (error.status === 0) {
        toast.error('Erro de conexão com o servidor');
      } else if (error.status >= 500) {
        toast.error('Erro interno do servidor');
      }

      return throwError(() => error);
    })
  );
};
