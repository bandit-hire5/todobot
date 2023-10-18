import TelegramBot, { Message } from "node-telegram-bot-api";
import IScript from "~src/interfaces/script";
import GLOBAL_IDENTIFIERS from "~src/di/identifiers";
import IDENTIFIERS from "~bot/di/identifiers";
import { inject, injectable, interfaces } from "inversify";
import IObserver, { ObserverTypes } from "~src/interfaces/observer";
import { textProcessor, callbackProcessor } from "~bot/utils/processor";
import IUserRepository from "~bot/interfaces/user-repository";
import IStrategy from "~bot/interfaces/processors/strategy";
import { LIST } from "~bot/commands";
import INoteRepository from "~bot/interfaces/note-repository";
import { listItemMessage } from "~bot/utils/message";

@injectable()
export default class ServerScript implements IScript {
  @inject(IDENTIFIERS.TELEGRAM_BOT) bot: TelegramBot;
  @inject(IDENTIFIERS.USER_REPOSITORY) userRepository: IUserRepository;
  @inject(IDENTIFIERS.NOTE_REPOSITORY) noteRepository: INoteRepository;
  @inject(IDENTIFIERS.TEXT_STRATEGY_FACTORY) factory: interfaces.Factory<IStrategy<Message>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @inject(GLOBAL_IDENTIFIERS.EVENT_OBSERVER) observer: IObserver<any>;

  //https://habr.com/ru/articles/740796/
  public async run(): Promise<void> {
    this.bot.on("polling_error", (err) => console.log(err));

    this.bot.on("callback_query", callbackProcessor);

    this.bot.on("text", textProcessor);

    this.observer.subscribe(async ({ type, data }) => {
      switch (type) {
        case ObserverTypes.DailyReminder:
          const list = await this.userRepository.getList();

          for (const user of list) {
            const strategy = this.factory(LIST) as IStrategy<Pick<Message, "chat">>;

            await strategy.process({ user }, { chat: { id: parseInt(user.tgChatId), type: "private" } });
          }
          break;

        case ObserverTypes.RemindLater:
          const { noteId, tgChatId } = data;

          const user = await this.userRepository.get(tgChatId);
          const note = await this.noteRepository.get({ user }, noteId);

          const { text, parseMode, buttons } = listItemMessage(note);

          await this.bot.sendMessage(tgChatId, text, {
            reply_markup: {
              inline_keyboard: buttons,
            },
            parse_mode: parseMode,
          });
          break;
      }
    });
  }
}
