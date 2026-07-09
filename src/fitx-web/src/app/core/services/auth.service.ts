import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User, QuickLoginAccount, QuickLoginResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.token());
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  isProfessor = computed(() => this.currentUser()?.role === 'Professor');
  isAluno = computed(() => this.currentUser()?.role === 'Aluno');
  isRecepcionista = computed(() => this.currentUser()?.role === 'Recepcionista');
  isFinanceiro = computed(() => this.currentUser()?.role === 'Financeiro');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userJson = localStorage.getItem('user');

    if (token && refreshToken && userJson) {
      this.token.set(token);
      this.currentUser.set(JSON.parse(userJson));
      // Refresh profile in background when session is restored
      this.getCurrentUser().subscribe({
        next: user => {
          if (user) {
            this.currentUser.set(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        },
        error: () => {
          /* keep cached user if /me is unavailable */
        }
      });
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.refreshToken) {
            this.setSession(response);
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.refreshToken) {
            this.setSession(response);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    this.token.set(null);
    this.currentUser.set(null);

    this.router.navigate(['/']);
  }

  refreshToken(): Observable<AuthResponse> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token || !refreshToken) {
      return throwError(() => new Error('No tokens available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {
      token,
      refreshToken
    }).pipe(
      tap(response => {
        if (response.success && response.token && response.refreshToken) {
          this.setSession(response);
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/reset-password`, {
      email,
      token,
      newPassword
    });
  }

  getQuickLogins(): Observable<QuickLoginResponse> {
    return this.http.get<QuickLoginResponse>(`${this.API_URL}/quick-logins`);
  }

  quickLogin(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/quick-login`, { email })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.refreshToken) {
            this.setSession(response);
          }
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  getToken(): string | null {
    return this.token();
  }

  private setSession(response: AuthResponse): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    localStorage.setItem('token', response.token!);
    localStorage.setItem('refreshToken', response.refreshToken!);

    const user: User = this.parseJwt(response.token!);
    localStorage.setItem('user', JSON.stringify(user));

    this.token.set(response.token!);
    this.currentUser.set(user);
  }

  private parseJwt(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
    const emailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
    const idClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    return {
      id: payload[idClaim] || payload.nameid,
      email: payload[emailClaim] || payload.email,
      name: payload[nameClaim] || payload.name,
      role: payload[roleClaim] || payload.role
    };
  }
}
