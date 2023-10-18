import { InlineKeyboardButton, ParseMode } from "node-telegram-bot-api";
import { UserFull as IUserFull } from "~src/interfaces/entity/user";

export default interface Context {
  readonly user?: IUserFull;
}

export interface Message {
  readonly parseMode: ParseMode;
  readonly text: string;
  readonly buttons?: InlineKeyboardButton[][];
}
