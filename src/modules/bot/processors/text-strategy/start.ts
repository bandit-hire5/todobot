import { inject, injectable } from "inversify";
import TelegramBot, { Message } from "node-telegram-bot-api";
import IStrategy from "~bot/interfaces/processors/strategy";
import IContext from "~bot/interfaces/app";
import IDENTIFIERS from "~bot/di/identifiers";
import { LIST, START } from "~bot/commands";
import IUserRepository from "~bot/interfaces/user-repository";
import { welcomeMessage } from "~bot/utils/message";

@injectable()
export default class Start implements IStrategy<Message> {
  @inject(IDENTIFIERS.TELEGRAM_BOT) bot: TelegramBot;
  @inject(IDENTIFIERS.USER_REPOSITORY) userRepository: IUserRepository;

  public static command = START;

  async process(context: IContext, { chat }: Message): Promise<void> {
    await this.userRepository.create({
      tgChatId: chat.id.toString(),
    });

    const { text, parseMode } = welcomeMessage();

    await this.bot.sendMessage(chat.id, text, {
      reply_markup: { keyboard: [[{ text: LIST }]], resize_keyboard: true },
      parse_mode: parseMode,
    });
  }
}
