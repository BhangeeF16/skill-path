import { NextResponse } from 'next/server';
import { ZodError, type ZodType } from 'zod';
import { AppError, ErrorCode } from '@/lib/errors/app-error';
import { toAppError } from '@/server/graph/driver';

/**
 * The only way a route returns a failure. Keeps `{ error: { code, message } }`
 * the single client-visible error shape and keeps driver detail — URIs, stack
 * traces, Cypher — on the server.
 */
export function errorResponse(error: unknown): NextResponse {
  const appError = error instanceof ZodError
    ? new AppError(ErrorCode.VALIDATION_ERROR, 'That request was not valid.', { cause: error })
    : toAppError(error);

  console.error(`[skillpath] ${appError.code}:`, appError.cause ?? appError);

  return NextResponse.json(appError.toResponseBody(), { status: appError.status });
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
