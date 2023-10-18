export enum WorkerMessages {
  NEW_PAIR = "NEW_PAIR",
}

export interface WorkerMessage {
  readonly type: WorkerMessages;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}
