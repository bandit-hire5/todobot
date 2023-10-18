import { injectable, Container, interfaces } from "inversify";
import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import IScript from "~src/interfaces/script";
import { NAMES, Module as IModule } from "~src/interfaces/module";
import ServerScript from "~bot/scripts/server";
import IDENTIFIERS from "~bot/di/identifiers";
import IUserRepository from "~bot/interfaces/user-repository";
import UserRepository from "~bot/models/user-repository";
import INoteRepository from "~bot/interfaces/note-repository";
import NoteRepository from "~bot/models/note-repository";
import { API_KEY_BOT } from "~bot/constants";
import IStrategy from "~bot/interfaces/processors/strategy";
import { getCommandDiIdentifier } from "~bot/utils/strategy";
import textStrategies from "~bot/processors/text-strategy";
import callbackStrategies from "~bot/processors/callback-strategy";
import { FREE_TEXT } from "~bot/commands";

@injectable()
export default class BotModule implements IModule {
  public static moduleName = NAMES.BOT;

  private runScript: IScript;

  async initialize(container: Container): Promise<void> {
    container.bind<IScript>(IDENTIFIERS.BOT_RUN_SCRIPT).to(ServerScript).inSingletonScope();

    container.bind<IUserRepository>(IDENTIFIERS.USER_REPOSITORY).to(UserRepository).inSingletonScope();
    container.bind<INoteRepository>(IDENTIFIERS.NOTE_REPOSITORY).to(NoteRepository).inSingletonScope();

    container
      .bind<TelegramBot>(IDENTIFIERS.TELEGRAM_BOT)
      .toConstantValue(new TelegramBot(API_KEY_BOT, { polling: true }));

    container
      .bind<interfaces.Factory<IStrategy<Message>>>(IDENTIFIERS.TEXT_STRATEGY_FACTORY)
      .toFactory<IStrategy<Message>>((context: interfaces.Context) => (command: string): IStrategy<Message> => {
        try {
          return context.container.get(getCommandDiIdentifier(command));
        } catch (e) {
          return context.container.get(getCommandDiIdentifier(FREE_TEXT));
        }
      });

    for (const strategy of textStrategies) {
      container.bind<IStrategy<Message>>(getCommandDiIdentifier(strategy.command)).to(strategy).inSingletonScope();
    }

    container
      .bind<interfaces.Factory<IStrategy<CallbackQuery>>>(IDENTIFIERS.CALLBACK_STRATEGY_FACTORY)
      .toFactory<IStrategy<CallbackQuery>>(
        (context: interfaces.Context) =>
          (command: string): IStrategy<CallbackQuery> =>
            context.container.get(getCommandDiIdentifier(command))
      );

    for (const strategy of callbackStrategies) {
      container
        .bind<IStrategy<CallbackQuery>>(getCommandDiIdentifier(strategy.command))
        .to(strategy)
        .inSingletonScope();
    }

    this.runScript = container.get<IScript>(IDENTIFIERS.BOT_RUN_SCRIPT);
  }

  async run(): Promise<void> {
    await this.runScript.run();
  }
}
