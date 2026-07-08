import { Component, OnDestroy, OnInit, ViewEncapsulation, computed, inject, input, output, signal } from '@angular/core';

import { Toast } from '../../models/toast.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'toaster-item',
  templateUrl: './toast-item.component.html',
  styleUrl: './toast-item.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': "'alert'",
    '[attr.aria-live]': "toast().type === 'error' ? 'assertive' : 'polite'",
    'aria-atomic': 'true',
    '[style.--toast-item-bg]': 'toast().backgroundColor || null',
    '[style.--toast-item-color]': 'toast().textColor || null',
    '[style.--toast-item-border-accent]': 'toast().borderColor || null',
    '(mouseenter)': 'pauseTimer()',
    '(mouseleave)': 'resumeTimer()',
  },
})
export class ToastItemComponent implements OnInit, OnDestroy {
  public readonly toast = input.required<Toast>();
  public readonly dismiss = output<string>();

  private readonly toastService = inject(ToastService);
  private timerId: ReturnType<typeof setTimeout> | null = null;

  protected readonly isHovered = signal(false);
  protected readonly timerKey = signal(0);

  protected readonly hostClass = computed(() => {
    const classes = [`toaster-item`, `toaster-item--${this.toast().type}`];
    if (this.toast().disableAnimation) classes.push('toaster-item--no-animation');
    if (this.isHovered()) classes.push('toaster-item--hovered');
    return classes.join(' ');
  });

  public ngOnInit(): void {
    this.startTimer();
  }

  public ngOnDestroy(): void {
    this.clearTimer();
  }

  protected pauseTimer(): void {
    this.clearTimer();
    this.timerKey.update((k) => k + 1);
    this.isHovered.set(true);
    this.toastService.setHovered(this.toast().id, true);
  }

  protected resumeTimer(): void {
    this.isHovered.set(false);
    this.toastService.setHovered(this.toast().id, false);
    this.startTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.timerKey.update((k) => k + 1);
    const { duration, id } = this.toast();
    if (duration > 0) {
      this.timerId = setTimeout(() => this.dismiss.emit(id), duration);
    }
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
