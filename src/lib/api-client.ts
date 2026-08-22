import { ErrorCode } from '@/lib/errors/app-error';

/** What the UI knows about a failure. Never a stack trace, never a URI. */
export interface UiError {
  code: ErrorCode;
  message: string;
  /** Retrying only helps when the cause is transient. */
  retryable: boolean;
}

const RETRYABLE: ErrorCode[] = [ErrorCode.DATABASE_UNAVAILABLE, ErrorCode.UNKNOWN_ERROR];

/** Fetches JSON and turns any failure into the one shape the UI renders. */
export async function getJson<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw toUiError({ code: ErrorCode.DATABASE_UNAVAILABLE, message: 'Could not reach the server.' });
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (body as { error?: { code?: string; message?: string } } | null)?.error;
    throw toUiError({
      code: (error?.code as ErrorCode) ?? ErrorCode.UNKNOWN_ERROR,
      message: error?.message ?? 'Something went wrong.',
    });
  }

  return body as T;
}

function toUiError(partial: { code: ErrorCode; message: string }): UiError {
  return { ...partial, retryable: RETRYABLE.includes(partial.code) };
}

/** Anything a rejected promise can carry, narrowed to what the UI can render. */
export function asUiError(caught: unknown): UiError {
  const isUiError =
    typeof caught === 'object' && caught !== null && 'code' in caught && 'retryable' in caught;

  return isUiError
    ? (caught as UiError)
    : { code: ErrorCode.UNKNOWN_ERROR, message: 'Something went wrong.', retryable: true };
}

/** The four states every async operation on screen can be in. */
export type Async<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: UiError };
