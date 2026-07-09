import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkAccess(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkAccess(childRoute);
  }

  private checkAccess(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login']);
    }

    const requiredRoles = this.resolveRoles(route);
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.authService.user()?.role;
      if (!userRole || !requiredRoles.includes(userRole)) {
        return this.router.createUrlTree([this.getHomeRoute(userRole)]);
      }
    }

    return true;
  }

  /** Prefer roles on the current route; fall back to deepest child (parent canActivate). */
  private resolveRoles(route: ActivatedRouteSnapshot): string[] | undefined {
    let current: ActivatedRouteSnapshot | null = route;
    let roles = current.data['roles'] as string[] | undefined;

    while (current.firstChild) {
      current = current.firstChild;
      if (current.data['roles']) {
        roles = current.data['roles'] as string[];
      }
    }

    return roles;
  }

  private getHomeRoute(role?: string): string {
    const routes: Record<string, string> = {
      Admin: '/admin',
      Professor: '/professor',
      Recepcionista: '/recepcao',
      Financeiro: '/financeiro'
    };
    return routes[role || ''] || '/dashboard';
  }
}
