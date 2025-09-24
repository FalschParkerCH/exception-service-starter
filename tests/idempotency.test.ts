import { ExceptionServiceImpl } from "../src/exceptionService";
import { AppException } from "../src/exceptions";
import type { Handler } from "../src/handlers";

function mkHandler(
  name: string,
  fn: Handler["run"],
  idempotent = false
): Handler {
  return { name, run: fn, idempotent };
}

describe("idempotency", () => {
  test("skips idempotent handler within window", async () => {
    const svc = new ExceptionServiceImpl();

    let count = 0;
    const toast = mkHandler(
      "toast",
      () => {
        count++;
      },
      true
    );
    svc.register("NetworkError", [toast]);

    await svc.throw(new AppException("NetworkError", "failed"));
    await svc.throw(new AppException("NetworkError", "failed"));

    expect(count).toBe(1);
  });
});
