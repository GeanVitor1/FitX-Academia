import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0 }))
  ])
]);

export const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
  ])
]);

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
  ])
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0 }),
    animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
  ])
]);

export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      stagger('50ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);
