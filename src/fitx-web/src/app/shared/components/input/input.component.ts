import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper">
      @if (label()) {
        <label class="input-label">{{ label() }}</label>
      }
      <div class="input-container">
        @if (icon()) {
          <span class="input-icon">{{ icon() }}</span>
        }
        <input
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="input-field"
          [class.has-icon]="icon()"
          [class.error]="error()"
        />
      </div>
      @if (error()) {
        <span class="input-error">{{ error() }}</span>
      }
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      color: var(--color-text-secondary);
      font-size: 1rem;
    }

    .input-field {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .input-field.has-icon {
      padding-left: 2.5rem;
    }

    .input-field:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .input-field:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-field.error {
      border-color: var(--color-danger);
    }

    .input-field.error:focus {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 10%, transparent);
    }

    .input-field::placeholder {
      color: var(--color-text-tertiary);
    }

    .input-error {
      font-size: 0.75rem;
      color: var(--color-danger);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  type = input<'text' | 'password' | 'email' | 'number'>('text');
  label = input<string>('');
  placeholder = input<string>('');
  icon = input<string>('');
  disabled = input(false);
  error = input<string>('');

  value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
