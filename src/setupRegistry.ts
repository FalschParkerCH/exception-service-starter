import { ExceptionServiceImpl } from "./exceptionService";
import {
  logToSentry,
  showToast,
  navigateToLogin,
  clearAuth,
} from "./exampleHandlers";

export const exceptionService = new ExceptionServiceImpl();

export function setupExceptionRegistry() {
  exceptionService.register("NetworkError", [showToast, logToSentry]);
  exceptionService.register("FeatureFlagError", [logToSentry]);
  exceptionService.register("AuthError", [
    logToSentry,
    clearAuth,
    navigateToLogin,
    showToast,
  ]);
  exceptionService.register("UnknownError", [logToSentry, showToast]);
}
