import { inject, injectable } from "inversify";
import TelegramBot, { Message } from "node-telegram-bot-api";
import IStrategy from "~bot/interfaces/processors/strategy";
import IContext from "~bot/interfaces/app";
import IDENTIFIERS from "~bot/di/identifiers";
import { FREE_TEXT, LIST } from "~bot/commands";
import INoteRepository from "~bot/interfaces/note-repository";
import { noteAddedMessage } from "~bot/utils/message";

@injectable()
export default class FreeText implements IStrategy<Message> {
  @inject(IDENTIFIERS.TELEGRAM_BOT) bot: TelegramBot;
  @inject(IDENTIFIERS.NOTE_REPOSITORY) noteRepository: INoteRepository;

  public static command = FREE_TEXT;

  async process(context: IContext, { chat, text }: Message): Promise<void> {
    const note = await this.noteRepository.create(context, { text });

    const { text: message, parseMode, buttons } = noteAddedMessage(note);

    await this.bot.sendMessage(chat.id, message, {
      reply_markup: {
        inline_keyboard: buttons,
      },
      parse_mode: parseMode,
    });
  }
}
