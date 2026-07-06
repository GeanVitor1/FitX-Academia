import { inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function RoleGuard(...roles: string[]) {
  return (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    const userRole = authService.user()?.role;
    if (!userRole || !roles.includes(userRole)) {
      const routes: Record<string, string> = {
        'Admin': '/admin',
        'Professor': '/alunos',
        'Recepcionista': '/recepcao',
        'Financeiro': '/financeiro'
      };
      router.navigate([routes[userRole || ''] || '/dashboard']);
      return false;
    }

    return true;
  };
}
