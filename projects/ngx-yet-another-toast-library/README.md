# ngx-yet-another-toast-library

[![npm](https://img.shields.io/npm/v/ngx-yet-another-toast-library)](https://www.npmjs.com/package/ngx-yet-another-toast-library)
[![demo](https://img.shields.io/badge/demo-live-blue)](https://zeeraa.github.io/ngx-yet-another-toast-library/)

A lightweight, signal-based Angular toast notification library with Bootstrap 5 color palette support. No template tag required — the container mounts itself automatically.

## Requirements

- Angular 22+

## Installation

```bash
npm install ngx-yet-another-toast-library
```

## Setup

Call `provideToastService()` in your `app.config.ts`:

```typescript
import { provideToastService } from 'ngx-yet-another-toast-library';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastService()
  ],
};
```

That's it — no `<toast-container>` tag needed.

## Usage

Inject `ToastService` and call any notification method:

```typescript
import { ToastService } from 'ngx-yet-another-toast-library';

@Component({ ... })
export class AppComponent {
  private readonly toastService = inject(ToastService);

  showExamples() {
    this.toastService.info('This is an info message', 'Info');
    this.toastService.success('Saved successfully!');
    this.toastService.error('Something went wrong', 'Error');
    this.toastService.warning('Please check your input');
  }
}
```

### All notification types

```typescript
toastService.info(message, title?, options?)
toastService.success(message, title?, options?)
toastService.error(message, title?, options?)
toastService.warning(message, title?, options?)
toastService.primary(message, title?, options?)
toastService.secondary(message, title?, options?)
toastService.light(message, title?, options?)
toastService.dark(message, title?, options?)
toastService.custom(data: CustomToastData)  // fully custom colors
```

### Dismissing toasts

```typescript
const ref = toastService.info('Hello!');

// Dismiss a specific toast
toastService.dismiss(ref.id);

// Dismiss all toasts
toastService.dismissAll();
```

## Configuration

Pass a `ToasterConfig` object to `provideToastService()`:

```typescript
provideToastService({
  position: 'bottom-right',    // default: 'top-right'
  newestOnTop: false,          // default: true
  defaultOptions: {
    duration: 3000,            // ms, 0 = no auto-dismiss. default: 5000
    dismissible: true,         // show close button. default: true
    progressBar: true,         // shrinking progress bar. default: false
    disableAnimation: false,   // default: false
  },
})
```

### Positions

`'top-right'` | `'top-left'` | `'top-center'` | `'bottom-right'` | `'bottom-left'` | `'bottom-center'`

### Per-toast options (`ToastOptions`)

| Option             | Type      | Default | Description                                      |
|--------------------|-----------|---------|--------------------------------------------------|
| `duration`         | `number`  | `5000`  | Auto-dismiss delay in ms. `0` disables it.       |
| `dismissible`      | `boolean` | `true`  | Show a close button.                             |
| `progressBar`      | `boolean` | `false` | Show a shrinking progress bar.                   |
| `disableAnimation` | `boolean` | `false` | Skip the enter animation.                        |

## ToastRef

Every method returns a `ToastRef` with reactive state:

```typescript
const ref = toastService.success('Done!');

ref.id          // string — unique ID
ref.isActive()  // signal<boolean> — true while visible
ref.isHovered() // signal<boolean> — true while mouse is over the toast
ref.dismiss()   // programmatically dismiss
ref.onDismiss$  // Observable<void> — emits when dismissed
```

## Custom toasts

Use `toastService.custom()` to supply your own colors:

```typescript
toastService.custom({
  message: 'Purple toast!',
  title: 'Custom',
  backgroundColor: '#7c3aed',
  textColor: '#ffffff',
  borderColor: '#5b21b6',
});
```

## Theming

Colors match the Bootstrap 5 subtle palette by default. Override any token globally in your `styles.scss`:

```scss
:root {
  --toast-success-bg:     #d1e7dd;
  --toast-success-color:  #0a3622;
  --toast-success-border: #a3cfbb;
}
```

Available tokens (replace `*` with a type name):

| Token                  | Types                                                  |
|------------------------|--------------------------------------------------------|
| `--toast-*-bg`       | `info`, `success`, `error`, `warning`, `primary`, `secondary`, `light`, `dark` |
| `--toast-*-color`    | same as above                                          |
| `--toast-*-border`   | same as above                                          |

## License

MIT — see [LICENSE](https://github.com/Zeeraa/ngx-yet-another-toast-library/blob/main/LICENSE).
