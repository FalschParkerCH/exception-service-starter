export type ExceptionType =
  | "AuthError"
  | "NetworkError"
  | "FeatureFlagError"
  | "UnknownError";

export class AppException extends Error {
  constructor(
    public type: ExceptionType,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = type;
  }
}
