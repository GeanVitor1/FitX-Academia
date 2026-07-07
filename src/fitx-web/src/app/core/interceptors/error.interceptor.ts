import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/revoke')) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else if (error.status === 400 || error.status === 409) {
        const msg = error.error?.errors?.[0] || error.error?.message || 'Erro na requisição';
        toast.error(msg);
      }
      return throwError(() => error);
    })
  );
};
