# Exception Handling Service – Candidate Exercise


## What to build
Implement a global exception handling service that:
1. Lets code throw **global exceptions** by type.
2. Looks up handlers in a **registry**.
3. Dispatches handlers in **order** (supports async) and **isolates failures**.
4. Supports **idempotent** handlers (skip within a short window).
5. Returns a **DispatchResult** for telemetry.


### Required exception types
- `AuthError`, `NetworkError`, `FeatureFlagError`, `UnknownError`.


### Required handlers (provided as stubs)
- `logToSentry`, `showToast`, `navigateToLogin`, `clearAuth`.


### Deliverables
- Working implementation in `src/exceptionService.ts` and `src/setupRegistry.ts`.
- Tests in `__tests__/` must pass (you may add more).


### Nice-to-have (bonus)
- Per-type **rate limiting** (e.g., max once per 3s).
- Per-handler **timeout**/cancellation.
- React error boundary that funnels errors into the service.


## Getting started
```bash
npm i
npm test
npm run build