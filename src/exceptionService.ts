import { AppException } from "./exceptions";
import type { ExceptionService, DispatchResult } from "./service";
import type { Handler, Registry } from "./handlers";

export class ExceptionServiceImpl implements ExceptionService {
  private registry: Registry = {};
  private recent: Map<string, number> = new Map(); // for idempotency/rate limiting
  private idempotencyWindowMs = 1500; // can be tuned or made per-handler

  register(type: string, handlers: Handler[]) {
    this.registry[type] = handlers;
  }

  clear() {
    this.registry = {};
    this.recent.clear();
  }

  async throw(e: AppException): Promise<DispatchResult> {
    const startedAt = Date.now();
    const handlers = this.registry[e.type] ?? [];
    const results: DispatchResult["results"] = [];

    for (const h of handlers) {
      const key = `${e.type}:${h.name}`;
      const now = Date.now();

      if (
        h.idempotent &&
        now - (this.recent.get(key) ?? 0) < this.idempotencyWindowMs
      ) {
        // Consider a skipped idempotent run as success with 0 duration
        results.push({ handler: h.name, ok: true, durationMs: 0 });
        continue;
      }

      const t0 = performance.now?.() ?? Date.now();
      try {
        await Promise.resolve(h.run(e, { now }));
        this.recent.set(key, now);
        const t1 = performance.now?.() ?? Date.now();
        results.push({
          handler: h.name,
          ok: true,
          durationMs: Math.round((t1 as number) - (t0 as number)),
        });
      } catch (err: any) {
        const t1 = performance.now?.() ?? Date.now();
        results.push({
          handler: h.name,
          ok: false,
          durationMs: Math.round((t1 as number) - (t0 as number)),
          reason: err?.message ?? String(err),
        });
        // continue to next handler
      }
    }

    return { error: e, startedAt, finishedAt: Date.now(), results };
  }
}
