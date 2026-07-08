import { Component, computed, inject, signal } from '@angular/core';
import { ToastService } from 'ngx-yet-another-toast-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly toastService = inject(ToastService);

  protected readonly message = signal('This is a notification message.');
  protected readonly title = signal('Notification');
  protected readonly duration = signal(5000);
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
}
