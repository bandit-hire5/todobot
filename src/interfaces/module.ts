import { interfaces } from "inversify";

export interface Module {
  initialize?(container: interfaces.Container): Promise<void>;
  run(): Promise<void>;
}

export enum NAMES {
  BOT = "bot",
  SCHEDULER = "scheduler",
}

export interface ModuleFilters {
  readonly names?: string[];
}
