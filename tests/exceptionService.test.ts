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

describe("ExceptionServiceImpl", () => {
  test("runs handlers in order and isolates failures", async () => {
    const svc = new ExceptionServiceImpl();

    const calls: string[] = [];
    const h1 = mkHandler("h1", async () => {
      calls.push("h1");
    });
    const h2 = mkHandler("h2", async () => {
      calls.push("h2");
      throw new Error("boom");
    });
    const h3 = mkHandler("h3", async () => {
      calls.push("h3");
    });

    svc.register("NetworkError", [h1, h2, h3]);

    const res = await svc.throw(new AppException("NetworkError", "oops"));

    expect(calls).toEqual(["h1", "h2", "h3"]);
    expect(res.results).toHaveLength(3);
    expect(res.results[0].ok).toBe(true);
    expect(res.results[1].ok).toBe(false);
    expect(res.results[1].reason).toBe("boom");
    expect(res.results[2].ok).toBe(true);
  });
});
