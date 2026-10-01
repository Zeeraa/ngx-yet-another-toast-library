import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ToastService } from 'ngx-yet-another-toast-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '[attr.data-bs-theme]': 'theme()',
  },
})
export class App {
  private readonly document = inject(DOCUMENT);
  protected readonly toastService = inject(ToastService);
  protected readonly theme = signal<'light' | 'dark'>('light');

  protected readonly message = signal('This is a notification message.');
  protected readonly title = signal('Notification');
  protected readonly duration = signal(5000);
  protected readonly offsetX = signal('');
  protected readonly offsetY = signal('');
  protected readonly dismissible = signal(true);
  protected readonly progressBar = signal(false);
  protected readonly disableAnimation = signal(false);

  protected readonly options = computed(() => ({
    duration: this.duration(),
    dismissible: this.dismissible(),
    progressBar: this.progressBar(),
    disableAnimation: this.disableAnimation(),
  }));

  protected readonly customBg = signal('#6f42c1');
  protected readonly customColor = signal('#ffffff');
  protected readonly customBorder = signal('#5a32a3');

  protected setOffsetX(offsetX: string): void {
    this.offsetX.set(offsetX);
    this.toastService.setOffset(offsetX || null);
  }

  protected setOffsetY(offsetY: string): void {
    this.offsetY.set(offsetY);
    this.toastService.setOffset(undefined, offsetY || null);
  }

  protected toggleTheme(): void {
    const nextTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(nextTheme);
    this.document.documentElement.setAttribute('data-bs-theme', nextTheme);
  }
}
