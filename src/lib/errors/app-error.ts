export const ErrorCode = {
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  DATABASE_UNAVAILABLE: 'DATABASE_UNAVAILABLE',
  QUERY_FAILED: 'QUERY_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const STATUS: Record<ErrorCode, number> = {
  CONFIGURATION_ERROR: 500,
  DATABASE_UNAVAILABLE: 503,
  QUERY_FAILED: 500,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  UNKNOWN_ERROR: 500,
};

/**
 * The only error shape that reaches the client. `message` is written for a
 * human; the original cause is kept for server logs and never serialised.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(code: ErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AppError';
    this.code = code;
    this.status = STATUS[code];
  }

  toResponseBody() {
    return { error: { code: this.code, message: this.message } };
  }
}
