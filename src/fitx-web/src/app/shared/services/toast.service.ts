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
    const id = ++this.counter;
    this.toasts.update(toasts => [...toasts, { id, message, type }]);

    setTimeout(() => this.dismiss(id), 5000);
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
