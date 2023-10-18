import INote, { NoteFull as INoteFull } from "~src/interfaces/entity/note";
import IContext from "~bot/interfaces/app";

export default interface UserRepository {
  get(context: IContext, id: string): Promise<INoteFull>;

  create(context: IContext, data: Omit<INote, "createdAt" | "updatedAt" | "status">): Promise<INoteFull>;

  update(context: IContext, id: string, data: Pick<INote, "status">): Promise<INoteFull>;

  remove(context: IContext, id: string): Promise<void>;

  getList(context: IContext): Promise<INoteFull[]>;
}
