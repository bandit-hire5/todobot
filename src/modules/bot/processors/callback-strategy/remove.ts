import { inject, injectable } from "inversify";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import IStrategy from "~bot/interfaces/processors/strategy";
import IContext from "~bot/interfaces/app";
import IDENTIFIERS from "~bot/di/identifiers";
import { REMOVE } from "~bot/commands";
import INoteRepository from "~bot/interfaces/note-repository";

@injectable()
export default class Remove implements IStrategy<CallbackQuery> {
  @inject(IDENTIFIERS.TELEGRAM_BOT) bot: TelegramBot;
  @inject(IDENTIFIERS.NOTE_REPOSITORY) noteRepository: INoteRepository;

  public static command = REMOVE;

  async process(
    context: IContext,
    { from: { id: chat_id }, message: { message_id }, data }: CallbackQuery
  ): Promise<void> {
    const [_, noteId] = data.split("#");

    await this.noteRepository.remove(context, noteId);

    await this.bot.deleteMessage(chat_id, message_id);
  }
}
