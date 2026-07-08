import { OnDestroy, Service, WritableSignal, computed, inject, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CustomToastData } from '../models/custom-toast-data';
import { Toast } from '../models/toast.model';
import { ToastRef } from '../models/toast-ref';
import { TOASTER_DEFAULT_OPTIONS, ToastOptions } from '../models/toast-options';
import { ToastPosition } from '../models/toast-position';
import { ToastType } from '../models/toast-type';

const DEFAULT_DURATION = 5000;
const DEFAULT_DISMISSIBLE = true;

@Service()
export class ToastService implements OnDestroy {
  private readonly _defaultOptions = inject(TOASTER_DEFAULT_OPTIONS, { optional: true });

  private readonly _toasts = signal<Toast[]>([]);
  private readonly _hoverSignals = new Map<string, WritableSignal<boolean>>();
  private readonly _dismissSubjects = new Map<string, Subject<void>>();

  private readonly _onCreateSubject = new Subject<Toast>();
  private readonly _onDismissSubject = new Subject<Toast>();

  private readonly _position = signal<ToastPosition>('top-right');
  private readonly _newestOnTop = signal<boolean>(true);

  public readonly toasts = this._toasts.asReadonly();

  /** The current position of the toast container. */
  public readonly position = this._position.asReadonly();
  /** Whether the newest toast appears closest to the screen edge. */
  public readonly newestOnTop = this._newestOnTop.asReadonly();

  /** Emits each time a new toast is created. */
  public readonly onCreate$: Observable<Toast> = this._onCreateSubject.asObservable();
  /** Emits each time a toast is dismissed (for any reason). */
  public readonly onDismiss$: Observable<Toast> = this._onDismissSubject.asObservable();

  /** Updates the position of the toast container. */
  public setPosition(position: ToastPosition): void {
    this._position.set(position);
  }

  /** Controls whether the newest toast appears closest to the screen edge. */
  public setNewestOnTop(newestOnTop: boolean): void {
    this._newestOnTop.set(newestOnTop);
  }

  /** Returns a snapshot of all currently active toasts. */
  public getAll(): readonly Toast[] {
    return this._toasts();
  }

  /**
   * @internal Called by ToastItemComponent to sync hover state into the service
   * so that ToastRef.isHovered stays up to date.
   */
  public setHovered(id: string, hovered: boolean): void {
    this._hoverSignals.get(id)?.set(hovered);
  }

  private createRef(id: string): ToastRef {
    const hoverSignal = signal(false);
    this._hoverSignals.set(id, hoverSignal);

    const dismissSubject = new Subject<void>();
    this._dismissSubjects.set(id, dismissSubject);

    const isActive = computed(() => this._toasts().some((t) => t.id === id));

    return {
      id,
      isActive,
      isDismissed: computed(() => !isActive()),
      isHovered: hoverSignal.asReadonly(),
      onDismiss$: dismissSubject.asObservable(),
      dismiss: () => this.dismiss(id),
    };
  }

  private add(type: ToastType, message: string, title?: string, options: ToastOptions = {}): ToastRef {
    const id = crypto.randomUUID();
    const ref = this.createRef(id);

    const toast: Toast = {
      id,
      type,
      message,
      title,
      duration: options.duration ?? this._defaultOptions?.duration ?? DEFAULT_DURATION,
      dismissible: options.dismissible ?? this._defaultOptions?.dismissible ?? DEFAULT_DISMISSIBLE,
      disableAnimation: options.disableAnimation ?? this._defaultOptions?.disableAnimation ?? false,
      progressBar: options.progressBar ?? this._defaultOptions?.progressBar ?? false,
    };

    this._toasts.update((current) => [...current, toast]);
    this._onCreateSubject.next(toast);
    return ref;
  }

  public info(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('info', message, title, options);
  }

  public success(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('success', message, title, options);
  }

  public error(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('error', message, title, options);
  }

  public warning(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('warning', message, title, options);
  }

  public primary(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('primary', message, title, options);
  }

  public secondary(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('secondary', message, title, options);
  }

  public light(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('light', message, title, options);
  }

  public dark(message: string, title?: string, options: ToastOptions = {}): ToastRef {
    return this.add('dark', message, title, options);
  }

  public custom(data: CustomToastData): ToastRef {
    const id = crypto.randomUUID();
    const ref = this.createRef(id);

    const toast: Toast = {
      id,
      type: 'custom',
      message: data.message,
      title: data.title,
      duration: data.duration ?? this._defaultOptions?.duration ?? DEFAULT_DURATION,
      dismissible: data.dismissible ?? this._defaultOptions?.dismissible ?? DEFAULT_DISMISSIBLE,
      disableAnimation: data.disableAnimation ?? this._defaultOptions?.disableAnimation ?? false,
      progressBar: data.progressBar ?? this._defaultOptions?.progressBar ?? false,
      textColor: data.textColor,
      backgroundColor: data.backgroundColor,
      borderColor: data.borderColor,
    };

    this._toasts.update((current) => [...current, toast]);
    this._onCreateSubject.next(toast);
    return ref;
  }

  public dismiss(id: string): void {
    const toast = this._toasts().find((t) => t.id === id);
    this._toasts.update((current) => current.filter((t) => t.id !== id));
    this._hoverSignals.delete(id);

    const dismissSubject = this._dismissSubjects.get(id);
    this._dismissSubjects.delete(id);

    if (toast) {
      dismissSubject?.next();
      dismissSubject?.complete();
      this._onDismissSubject.next(toast);
    }
  }

  public dismissAll(): void {
    const current = this._toasts();
    this._toasts.set([]);
    this._hoverSignals.clear();

    for (const toast of current) {
      const dismissSubject = this._dismissSubjects.get(toast.id);
      dismissSubject?.next();
      dismissSubject?.complete();
      this._onDismissSubject.next(toast);
    }
    this._dismissSubjects.clear();
  }

  public ngOnDestroy(): void {
    this._onCreateSubject.complete();
    this._onDismissSubject.complete();
    for (const subject of this._dismissSubjects.values()) {
      subject.complete();
    }
    this._dismissSubjects.clear();
  }
}
