import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private counter = 0;

  toasts$ = this.toasts.asReadonly();

  show(message: string, type: Toast['type'] = 'info'): void {
    const text = (message || '').trim();
    if (!text) return;

    // Evita spam do mesmo toast em sequência (ex.: várias requisições falhando)
    const existing = this.toasts();
    if (existing.some(t => t.message === text && t.type === type)) {
      return;
    }

    const id = ++this.counter;
    this.toasts.update(toasts => [...toasts, { id, message: text, type }]);

    const duration = type === 'error' ? 6500 : 4500;
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
