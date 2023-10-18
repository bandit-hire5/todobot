import IBase, { DeletableEntity as IDeletableEntity } from "~src/interfaces/app/base";

export default interface Note {
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly text: string;
  readonly status: NoteStatuses;
}

export type NoteFull = IBase & IDeletableEntity & Note;

export enum NoteStatuses {
  active = "active",
  done = "done",
}
