import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ToastRef {
  /** Unique ID of the toast. */
  readonly id: string;
  /** Signal that is `true` while the toast is still visible. */
  readonly isActive: Signal<boolean>;
  /** Signal that is `true` once the toast has been dismissed. */
  readonly isDismissed: Signal<boolean>;
  /** Signal that is `true` while the user is hovering over the toast. */
  readonly isHovered: Signal<boolean>;
  /** Emits once and completes when this toast is dismissed for any reason. */
  readonly onDismiss$: Observable<void>;
  /** Programmatically dismiss this toast. */
  dismiss(): void;
}
