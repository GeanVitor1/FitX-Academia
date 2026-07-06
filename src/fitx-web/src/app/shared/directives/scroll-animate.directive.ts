import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[scrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() animationType: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'fadeIn' | 'scaleIn' = 'fadeUp';
  @Input() delay: number = 0;
  @Input() threshold: number = 0.1;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;

    const animations: Record<string, string> = {
      fadeUp: 'translateY(40px)',
      fadeLeft: 'translateX(-40px)',
      fadeRight: 'translateX(40px)',
      fadeIn: 'none',
      scaleIn: 'scale(0.9)'
    };

    element.style.opacity = '0';
    element.style.transform = animations[this.animationType];
    element.style.transition = `opacity 0.8s ease ${this.delay}s, transform 0.8s ease ${this.delay}s`;
    element.style.willChange = 'opacity, transform';

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            this.observer.unobserve(element);
          }
        });
      },
      { threshold: this.threshold, rootMargin: '0px 0px -50px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
