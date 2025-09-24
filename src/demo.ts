import { AppException } from "./exceptions";
import { exceptionService, setupExceptionRegistry } from "./setupRegistry";

async function main() {
  setupExceptionRegistry();

  // Happy path
  const r1 = await exceptionService.throw(
    new AppException("NetworkError", "Failed to load feed", {
      endpoint: "/feed",
    })
  );
  console.log("Dispatch result 1", r1);

  // Idempotency (showToast/logToSentry are idempotent)
  const r2 = await exceptionService.throw(
    new AppException("NetworkError", "Failed to load feed", {
      endpoint: "/feed",
    })
  );
  console.log("Dispatch result 2", r2);

  // Auth flow
  const r3 = await exceptionService.throw(
    new AppException("AuthError", "Session expired")
  );
  console.log("Dispatch result 3", r3);
}

main().catch((e) => console.error(e));
