import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/** Maximum number of retry attempts for a 429 response. */
const MAX_RETRIES = 3;

/** Base delay in milliseconds for the exponential backoff formula. */
const BASE_DELAY_MS = 1_000;

/** Maximum random jitter added to each delay to prevent synchronized request spikes. */
const MAX_JITTER_MS = 300;

/**
 * Calculates the delay (in ms) before the next retry attempt.
 *
 * Priority order:
 *  1. `Retry-After` response header (seconds → ms) + jitter.
 *  2. Exponential backoff: `2^attempt × BASE_DELAY_MS` + jitter.
 *
 * @param attempt   - 1-based retry count supplied by the RxJS `retry` operator.
 * @param retryAfter - Raw value of the `Retry-After` header, or `null` if absent.
 */
function calculateBackoffDelay(attempt: number, retryAfter: string | null): number {
  const jitter = Math.random() * MAX_JITTER_MS;

  if (retryAfter !== null) {
    const retryAfterMs = parseInt(retryAfter, 10) * 1_000;
    if (!isNaN(retryAfterMs) && retryAfterMs > 0) {
      return retryAfterMs + jitter;
    }
  }

  return Math.pow(2, attempt) * BASE_DELAY_MS + jitter;
}

/**
 * Functional HTTP interceptor that handles HTTP 429 (Too Many Requests) responses
 * with an exponential backoff + jitter retry strategy.
 *
 * Behaviour:
 *  - Retries up to {@link MAX_RETRIES} times on 429.
 *  - Uses the `Retry-After` header when present; otherwise applies `2^attempt × 1000 ms`.
 *  - Adds random jitter to each delay to prevent thundering-herd spikes.
 *  - Propagates any non-429 error immediately without retrying.
 *  - Re-throws the final error if all retry attempts are exhausted.
 */
export const rateLimitInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: unknown, retryCount: number) => {
        if (error instanceof HttpErrorResponse && error.status === 429) {
          const retryAfterHeader = error.headers.get('Retry-After');
          const delayMs = calculateBackoffDelay(retryCount, retryAfterHeader);
          return timer(delayMs);
        }
        // Non-429 errors are not retried — propagate immediately.
        return throwError(() => error);
      },
    }),
    catchError((error: unknown) => throwError(() => error)),
  );
