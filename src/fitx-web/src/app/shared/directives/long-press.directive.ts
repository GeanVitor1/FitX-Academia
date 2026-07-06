import { Directive, ElementRef, EventEmitter, Output, HostListener, Input } from '@angular/core';

@Directive({ selector: '[longPress]', standalone: true })
export class LongPressDirective {
  @Output() longPress = new EventEmitter<void>();
  @Input() pressDelay: number = 500;

  private timeout: any;
  private isPressed = false;

  @HostListener('mousedown')
  onMouseDown() {
    this.isPressed = true;
    this.timeout = setTimeout(() => {
      if (this.isPressed) {
        this.longPress.emit();
      }
    }, this.pressDelay);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    this.isPressed = false;
    clearTimeout(this.timeout);
  }
}
