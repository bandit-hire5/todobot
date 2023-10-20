import { inject, injectable } from "inversify";
import TelegramBot, { Message } from "node-telegram-bot-api";
import IStrategy from "~bot/interfaces/processors/strategy";
import IContext from "~bot/interfaces/app";
import IDENTIFIERS from "~bot/di/identifiers";
import { LIST } from "~bot/commands";
import { delimiterMessage, emptyListMessage, listItemMessage } from "~bot/utils/message";
import INoteRepository from "~bot/interfaces/note-repository";

@injectable()
export default class List implements IStrategy<Message> {
  @inject(IDENTIFIERS.TELEGRAM_BOT) bot: TelegramBot;
  @inject(IDENTIFIERS.NOTE_REPOSITORY) noteRepository: INoteRepository;

  public static command = LIST;

  async process(context: IContext, { chat }: Pick<Message, "chat">): Promise<void> {
    const list = await this.noteRepository.getList(context);

    const { text, parseMode } = delimiterMessage();

    await this.bot.sendMessage(chat.id, text, {
      parse_mode: parseMode,
    });

    if (!list.length) {
      const { text, parseMode } = emptyListMessage();

      await this.bot.sendMessage(chat.id, text, {
        parse_mode: parseMode,
      });

      return;
    }

    for (const note of list) {
      const { text, parseMode, buttons } = listItemMessage(note);

      await this.bot.sendMessage(chat.id, text, {
        reply_markup: {
          inline_keyboard: buttons,
        },
        parse_mode: parseMode,
      });
    }
  }
}
