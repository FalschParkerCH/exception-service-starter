import type { AppException } from "./exceptions";

export type DispatchResult = {
  error: AppException;
  startedAt: number;
  finishedAt: number;
  results: {
    handler: string;
    ok: boolean;
    durationMs: number;
    reason?: string;
  }[];
};

export interface ExceptionService {
  throw: (e: AppException) => Promise<DispatchResult>;
  register: (type: string, handlers: import("./handlers").Handler[]) => void;
  clear: () => void;
}
