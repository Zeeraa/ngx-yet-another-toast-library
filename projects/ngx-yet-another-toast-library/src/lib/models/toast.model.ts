import { ToastType } from './toast-type';

export interface Toast {
  readonly id: string;
  readonly type: ToastType;
  readonly message: string;
  readonly title?: string;
  readonly duration: number;
  readonly dismissible: boolean;
  readonly disableAnimation: boolean;
  readonly progressBar: boolean;
  readonly textColor?: string;
  readonly backgroundColor?: string;
  readonly borderColor?: string;
}
