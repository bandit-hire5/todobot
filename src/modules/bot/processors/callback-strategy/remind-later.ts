import { inject, injectable } from "inversify";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import IStrategy from "~bot/interfaces/processors/strategy";
import IContext from "~bot/interfaces/app";
import IDENTIFIERS from "~bot/di/identifiers";
import { REMIND_LATER } from "~bot/commands";
import INoteRepository from "~bot/interfaces/note-repository";
import GLOBAL_IDENTIFIERS from "~src/di/identifiers";
import IObserver, { ObserverTypes } from "~src/interfaces/observer";
import { getCurrentUnixTimestamp } from "~src/utils/date";

@injectable()
export default class RemindLater implements IStrategy<CallbackQuery> {
  @inject(IDENTIFIERS.TELEGRAM_BOT) bot: TelegramBot;
  @inject(IDENTIFIERS.NOTE_REPOSITORY) noteRepository: INoteRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @inject(GLOBAL_IDENTIFIERS.EVENT_OBSERVER) observer: IObserver<any>;

  public static command = REMIND_LATER;

  async process(
    { user: { tgChatId } }: IContext,
    { from: { id: chat_id }, message: { message_id }, data }: CallbackQuery
  ): Promise<void> {
    const [_, noteId] = data.split("#");

    await this.observer.broadcast({
      type: ObserverTypes.CreateJob,
      data: {
        uniqueHash: JSON.stringify({ type: ObserverTypes.RemindLater, id: noteId }),
        scheduleOn: getCurrentUnixTimestamp() + 3600,
        data: { type: ObserverTypes.RemindLater, data: { noteId, tgChatId } },
      },
    });

    await this.bot.deleteMessage(chat_id, message_id);
  }
}
