import IBase, { DeletableEntity as IDeletableEntity } from "~src/interfaces/app/base";

export default interface User {
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly tgChatId: string;
}

export type UserFull = IBase & IDeletableEntity & User;
