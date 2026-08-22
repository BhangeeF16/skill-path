import { ErrorCode } from '@/lib/errors/app-error';
import type { UiError } from '@/lib/api-client';

/**
 * Every async operation renders one of these four. The error copy is keyed on
 * the error code, so "the graph is unreachable" and "nothing matched" read
 * differently — and Retry only appears where retrying can actually help.
 */

export function LoadingCard({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/15 dark:bg-white/[0.03]">
      <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40" />
      <p className="text-sm opacity-70">{label}</p>
    </div>
  );
}

export function EmptyCard({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 p-8 text-center dark:border-white/20">
      <p className="font-medium">{title}</p>
      {hint ? <p className="mt-1 text-sm opacity-70">{hint}</p> : null}
    </div>
  );
}

const HEADING: Record<ErrorCode, string> = {
  CONFIGURATION_ERROR: 'This environment is not configured yet',
  DATABASE_UNAVAILABLE: 'The graph is unreachable right now',
  QUERY_FAILED: 'That request could not be completed',
  NOT_FOUND: 'Nothing here',
  VALIDATION_ERROR: 'That request was not valid',
  UNKNOWN_ERROR: 'Something went wrong',
};

export function ErrorCard({ error, onRetry }: { error: UiError; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/[0.06] p-6 text-center"
    >
      <p className="font-medium text-red-700 dark:text-red-300">{HEADING[error.code] ?? HEADING.UNKNOWN_ERROR}</p>
      <p className="mt-1 text-sm opacity-80">{error.message}</p>
      {error.retryable && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-current px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
