import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.authService.user()?.role;
      if (!userRole || !requiredRoles.includes(userRole)) {
        this.router.navigate([this.getHomeRoute(userRole)]);
        return false;
      }
    }

    return true;
  }

  private getHomeRoute(role?: string): string {
    const routes: Record<string, string> = {
      'Admin': '/admin',
      'Professor': '/alunos',
      'Recepcionista': '/recepcao',
      'Financeiro': '/financeiro'
    };
    return routes[role || ''] || '/dashboard';
  }
}
