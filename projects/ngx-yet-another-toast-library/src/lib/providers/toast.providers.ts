import {
  ApplicationRef,
  EnvironmentInjector,
  EnvironmentProviders,
  PLATFORM_ID,
  createComponent,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ToastContainerComponent } from '../components/toast-container/toast-container.component';
import { TOASTER_DEFAULT_OPTIONS, ToastOptions } from '../models/toast-options';
import { ToastPosition } from '../models/toast-position';
import { ToastService } from '../services/toast.service';

export interface ToasterConfig {
  /** Position of the toast stack. Defaults to 'top-right'. */
  position?: ToastPosition;
  /** Optional horizontal inset override. Accepts a CSS length; unset uses the existing CSS inset (1rem). */
  offsetX?: string;
  /** Optional vertical inset override. Accepts a CSS length; unset uses the existing CSS inset (1rem). */
  offsetY?: string;
  /** Stacking order for the toast stack and default for individual toasts. Defaults to 1080. */
  zIndex?: number;
  /** Default options applied to every toast. Per-call options take priority over these. */
  defaultOptions?: ToastOptions;
  /** Whether the newest toast appears closest to the screen edge. Defaults to true. */
  newestOnTop?: boolean;
}

/**
 * Registers the toast container with the Angular application. Call this in
 * your `app.config.ts` providers array. The container is automatically
 * appended to `document.body` — no template tag required.
 *
 * @example
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideToastService()],
 * };
 */
export function provideToastService(config: ToasterConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TOASTER_DEFAULT_OPTIONS,
      useValue: {
        ...config.defaultOptions,
        zIndex: config.zIndex ?? config.defaultOptions?.zIndex ?? 1080,
      },
    },
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      const appRef = inject(ApplicationRef);
      const injector = inject(EnvironmentInjector);
      const toastService = inject(ToastService);

      if (config.position) {
        toastService.setPosition(config.position);
      }

      toastService.setOffset(config.offsetX, config.offsetY);

      if (config.newestOnTop !== undefined) {
        toastService.setNewestOnTop(config.newestOnTop);
      }

      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const ref = createComponent(ToastContainerComponent, {
        environmentInjector: injector,
      });

      appRef.attachView(ref.hostView);
      document.body.appendChild(ref.location.nativeElement);
    }),
  ]);
}
