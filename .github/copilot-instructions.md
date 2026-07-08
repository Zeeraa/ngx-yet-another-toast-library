
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project: ngx-yet-another-toast-library

This is an Angular workspace containing two projects:

- **`ngx-yet-another-toast-library`** — the published Angular library (`projects/ngx-yet-another-toast-library/`)
- **`demo`** — a development/demo application (`projects/demo/`) used to develop, test, and showcase the library

### Library structure

```
projects/ngx-yet-another-toast-library/src/lib/
  models/            # Toast, ToastOptions, ToastType, ToastPosition, CustomToastData
  services/          # ToastService (@Service, signal-based)
  components/
    toast-item/      # ToastItemComponent — individual notification (ViewEncapsulation.None)
    toast-container/ # ToastContainerComponent — stacking overlay (ViewEncapsulation.None)
  providers/         # provideToastService() — global setup, no template tag required
```

### CSS class prefix

All CSS classes use the **`toaster-`** prefix (e.g. `.toaster-container`, `.toaster-item`, `.toaster-item--info`).

### CSS custom properties

Default colors match Bootstrap 5 subtle palette. Users may override via CSS variables:

| Token                      | Default     |
|---------------------------|-------------|
| `--toast-info-bg`        | `#cff4fc`   |
| `--toast-success-bg`     | `#d1e7dd`   |
| `--toast-error-bg`       | `#f8d7da`   |
| `--toast-warning-bg`     | `#fff3cd`   |
| `--toast-primary-bg`     | `#cfe2ff`   |
| `--toast-secondary-bg`   | `#e2e3e5`   |
| `--toast-light-bg`       | `#f8f9fa`   |
| `--toast-dark-bg`        | `#d3d3d4`   |
| (plus matching `*-color` and `*-border` tokens for each type) |

### Key APIs

```typescript
// Setup (app.config.ts)
provideToastService(config?: ToasterConfig)

// Service methods
toastService.info(message, title?, options?)
toastService.success(message, title?, options?)
toastService.error(message, title?, options?)
toastService.warning(message, title?, options?)
toastService.primary(message, title?, options?)
toastService.secondary(message, title?, options?)
toastService.light(message, title?, options?)
toastService.dark(message, title?, options?)
toastService.custom(data: CustomToastData)
toastService.dismiss(id)
toastService.dismissAll()
```

### npm scripts

| Script           | Purpose                                    |
|------------------|--------------------------------------------|
| `npm start`      | Serve the demo app (development)           |
| `npm run build`  | Build the demo app                         |
| `npm run build:lib` | Build the library for publishing        |
| `npm run watch`  | Build library in watch mode                |
| `npm test`       | Run demo app tests                         |
| `npm run test:lib` | Run library tests                        |

---

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- **Always use the `public`, `protected`, and `private` keywords** on all class members
- **Always use the `readonly` keyword** on class members that are never reassigned

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- **Always use signals** for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
- **Always use separate `.html`, `.scss`, and `.ts` files** for components — no inline templates or styles

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- **Always use the `inject()` function** instead of constructor injection

## Styling

- **Always use SCSS** (`.scss`) — never plain CSS for new files
- Use the `toaster-` CSS class prefix for all library-related classes
- Use CSS custom properties (`--toast-*`) for all themeable values
