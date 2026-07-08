import { InjectionToken } from '@angular/core';

export interface ToastOptions {
  /** Auto-dismiss delay in milliseconds. Set to 0 to disable auto-dismiss. Defaults to 5000. */
  duration?: number;
  /** Whether a close button is shown. Defaults to true. */
  dismissible?: boolean;
  /** Disables the enter animation for this toast. Defaults to false. */
  disableAnimation?: boolean;
  /** Shows a progress bar that shrinks over the toast duration. Defaults to false. */
  progressBar?: boolean;
}

/** Injection token for the provider-level default options set via provideToastService(). */
export const TOASTER_DEFAULT_OPTIONS = new InjectionToken<ToastOptions>('TOASTER_DEFAULT_OPTIONS');
