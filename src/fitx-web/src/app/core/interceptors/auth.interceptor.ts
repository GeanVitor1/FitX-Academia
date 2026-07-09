import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const AUTH_SKIP_URLS = [
  '/login',
  '/register',
  '/refresh',
  '/forgot-password',
  '/reset-password',
  '/quick-login',
  '/quick-logins'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (AUTH_SKIP_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
