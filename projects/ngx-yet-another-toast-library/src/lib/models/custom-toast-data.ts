import { ToastOptions } from './toast-options';

export interface CustomToastData extends ToastOptions {
  /** The notification message body. */
  message: string;
  /** Optional title displayed above the message. */
  title?: string;
  /** Override the text color (any valid CSS color value). */
  textColor?: string;
  /** Override the background color (any valid CSS color value). */
  backgroundColor?: string;
  /** Override the accent border color (any valid CSS color value). */
  borderColor?: string;
}
