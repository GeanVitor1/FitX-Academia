import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[ripple]', standalone: true })
export class RippleDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const button = this.el.nativeElement;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute; border-radius: 50%; pointer-events: none;
      width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px;
      background: currentColor; opacity: 0.3; transform: scale(0);
      animation: ripple-effect 0.6s ease-out;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}
