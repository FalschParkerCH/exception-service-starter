import type { Handler } from "./handlers";
import type { AppException } from "./exceptions";

export const logToSentry: Handler = {
  name: "logToSentry",
  idempotent: true,
  run: async (e: AppException) => {
    // Replace with Sentry.captureException etc.
    console.log("[sentry]", e.type, e.message, e.context);
  },
};

export const showToast: Handler = {
  name: "showToast",
  idempotent: true,
  run: (e) => {
    // Replace with your toast lib
    console.log("[toast]", e.message);
  },
};

export const navigateToLogin: Handler = {
  name: "navigateToLogin",
  run: (_e, ctx) => ctx.navigator?.navigate("Login"),
};

export const clearAuth: Handler = {
  name: "clearAuth",
  run: async () => {
    console.log("[auth] cleared");
  },
};
