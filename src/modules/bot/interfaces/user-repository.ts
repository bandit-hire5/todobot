import IUser, { UserFull as IUserFull } from "~src/interfaces/entity/user";

export default interface UserRepository {
  get(tgChatId: string): Promise<IUserFull>;

  create(data: Omit<IUser, "createdAt" | "updatedAt">): Promise<IUserFull>;

  getList(): Promise<IUserFull[]>;
}
