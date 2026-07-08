import { Component, ViewEncapsulation, computed, inject } from '@angular/core';

import { ToastItemComponent } from '../toast-item/toast-item.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'toaster-container',
  imports: [ToastItemComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClass()',
    'aria-live': 'polite',
    'aria-atomic': 'false',
    'aria-label': 'Notifications',
  },
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  protected readonly orderedToasts = computed(() => {
    const toasts = this.toastService.toasts();
    const isBottom = this.toastService.position().startsWith('bottom');
    // For top positions: reverse so newest is first (top).
    // For bottom positions: natural order so newest is last (closest to screen edge).
    const shouldReverse = this.toastService.newestOnTop() ? !isBottom : isBottom;
    return shouldReverse ? [...toasts].reverse() : toasts;
  });

  protected readonly hostClass = computed(
    () => `toaster-container toaster-container--${this.toastService.position()}`,
  );
}
