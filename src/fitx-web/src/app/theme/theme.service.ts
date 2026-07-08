import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = signal<'dark' | 'light'>('dark');

  currentTheme = this.theme.asReadonly();
  isDark = () => this.theme() === 'dark';

  constructor() {
    const saved = localStorage.getItem('theme') as 'dark' | 'light';
    if (saved) {
      this.theme.set(saved);
    }
    this.applyTheme();

    effect(() => {
      const current = this.theme();
      localStorage.setItem('theme', current);
      this.applyTheme();
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.theme.set(theme);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
  }
}
