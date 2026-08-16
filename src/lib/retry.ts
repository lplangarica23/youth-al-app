// Free-tier AI APIs occasionally return a transient "server overloaded,
// try again" error (503) or a rate-limit error (429) — these are not
// bugs, they clear up on their own within seconds. Rather than fail
// the user's request on the first hiccup, retry a couple of times with
// a short increasing delay before actually giving up.
export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 2, baseDelayMs = 800 }: { retries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      const isTransient = status === 503 || status === 429;

      if (!isTransient || attempt === retries) {
        throw err;
      }

      const delay = baseDelayMs * Math.pow(2, attempt);
      console.warn(`Transient AI error (status ${status}), retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
