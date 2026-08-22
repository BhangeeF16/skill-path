import { NextResponse } from 'next/server';
import { ZodError, type ZodType } from 'zod';
import { AppError, ErrorCode } from '@/lib/errors/app-error';
import { toAppError } from '@/server/graph/driver';
import type { UiError } from '@/lib/api-client';

/**
 * The single mapping from anything thrown to the six-code taxonomy. Routes and
 * pages both go through it, so a bad id reads the same either way. Logs here
 * because this is the last point that still has the cause; nothing past it
 * carries a URI, a stack trace, or Cypher.
 */
function classify(error: unknown): AppError {
  const appError = error instanceof ZodError
    ? new AppError(ErrorCode.VALIDATION_ERROR, 'That request was not valid.', { cause: error })
    : toAppError(error);

  console.error(`[skillpath] ${appError.code}:`, appError.cause ?? appError);
  return appError;
}

/** How a route returns a failure: `{ error: { code, message } }`, always. */
export function errorResponse(error: unknown): NextResponse {
  const appError = classify(error);
  return NextResponse.json(appError.toResponseBody(), { status: appError.status });
}

/** How a server component returns one: an ErrorCard instead of a response. */
export function pageError(error: unknown): UiError {
  const { code, message } = classify(error);

  return {
    code,
    message,
    retryable: code === ErrorCode.DATABASE_UNAVAILABLE || code === ErrorCode.UNKNOWN_ERROR,
  };
}

/** Validates route params and runs the handler, mapping anything thrown. */
export async function handle<TParams, TResult>(
  schema: ZodType<TParams>,
  rawParams: unknown,
  run: (params: TParams) => Promise<TResult>,
): Promise<NextResponse> {
  try {
    const params = schema.parse(rawParams);
    return NextResponse.json(await run(params));
  } catch (error) {
    return errorResponse(error);
  }
}
