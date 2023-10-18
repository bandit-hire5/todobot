import IUser, { UserFull as IUserFull } from "~src/interfaces/entity/user";
import { inject, injectable } from "inversify";
import { ObjectType, Repository, EntityManager } from "typeorm";
import User from "~src/entities/user/user";
import IDENTIFIERS from "~src/di/identifiers";
import IUserRepository from "~bot/interfaces/user-repository";
import { getCurrentUnixTimestamp } from "~src/utils/date";
import { assert } from "~src/utils/validate";
import { executeTransaction } from "~src/utils/transactions";

@injectable()
export default class UserRepository implements IUserRepository {
  @inject(IDENTIFIERS.DB_DATA_REPOSITORY) getDbDataRepository: (entity: ObjectType<IUser>) => Repository<User>;

  protected get userDbRepository(): Repository<User> {
    return this.getDbDataRepository(User) as Repository<User>;
  }

  async get(tgChatId: string): Promise<IUserFull> {
    return this.userDbRepository.findOne({
      where: {
        tgChatId: tgChatId,
      },
    });
  }

  async create(data: Omit<IUser, "createdAt" | "updatedAt">): Promise<IUserFull> {
    let user = await this.userDbRepository.findOne({
      where: {
        tgChatId: data.tgChatId,
      },
    });

    if (user) {
      return user;
    }

    const createdAt = getCurrentUnixTimestamp();

    user = this.userDbRepository.create({
      ...data,
      id: undefined,
      createdAt,
    });

    await assert(user);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(User, user);
    });

    return user;
  }

  async getList(): Promise<IUserFull[]> {
    return this.userDbRepository.createQueryBuilder("User").getMany();
  }
}
