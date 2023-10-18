import INote, { NoteFull as INoteFull, NoteStatuses } from "~src/interfaces/entity/note";
import { inject, injectable } from "inversify";
import IContext from "~bot/interfaces/app";
import { ObjectType, Repository, EntityManager } from "typeorm";
import Note from "~src/entities/note/note";
import IDENTIFIERS from "~src/di/identifiers";
import INoteRepository from "~bot/interfaces/note-repository";
import { getCurrentUnixTimestamp } from "~src/utils/date";
import { assert } from "~src/utils/validate";
import { executeTransaction } from "~src/utils/transactions";
import AppError from "~src/models/error";
import { ERRORS } from "~src/interfaces/app/app";

@injectable()
export default class NoteRepository implements INoteRepository {
  @inject(IDENTIFIERS.DB_DATA_REPOSITORY) getDbDataRepository: (entity: ObjectType<INote>) => Repository<Note>;

  protected get noteDbRepository(): Repository<Note> {
    return this.getDbDataRepository(Note) as Repository<Note>;
  }

  async get({ user }: IContext, id: string): Promise<INoteFull> {
    return this.noteDbRepository.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });
  }

  async create({ user }: IContext, data: Omit<INote, "createdAt" | "updatedAt" | "status">): Promise<INoteFull> {
    const note = this.noteDbRepository.create({
      ...data,
      user,
      id: undefined,
      status: NoteStatuses.active,
      createdAt: getCurrentUnixTimestamp(),
    });

    await assert(note);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(Note, note);
    });

    return note;
  }

  async update({ user }: IContext, id: string, data: Pick<INote, "status">): Promise<INoteFull> {
    const note = await this.noteDbRepository.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!user) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "Note doesn't exist");
    }

    this.noteDbRepository.merge(note, data, { updatedAt: getCurrentUnixTimestamp() });

    await assert(user);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(Note, note);
    });

    return note;
  }

  async remove({ user }: IContext, id: string): Promise<void> {
    await this.noteDbRepository.delete({
      id,
      user: { id: user.id },
    });
  }

  async getList({ user }: IContext): Promise<INoteFull[]> {
    return this.noteDbRepository
      .createQueryBuilder("Note")
      .innerJoin("Note.user", "User")
      .where("User.id = :userId", { userId: user.id })
      .andWhere("Note.status = :status", { status: NoteStatuses.active })
      .orderBy("Note.createdAt", "ASC")
      .getMany();
  }
}
