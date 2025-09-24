import type { AppException } from "./exceptions";

export type HandlerContext = {
  now: number;
  navigator?: { navigate: (route: string) => void };
};

export type Handler = {
  name: string;
  idempotent?: boolean;
  run: (error: AppException, ctx: HandlerContext) => Promise<void> | void;
};

export type Registry = Record<string, Handler[]>;
