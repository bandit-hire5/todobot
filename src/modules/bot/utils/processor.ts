import { Message, CallbackQuery } from "node-telegram-bot-api";
import { interfaces } from "inversify";
import container from "~src/di";
import IStrategy from "~bot/interfaces/processors/strategy";
import IDENTIFIERS from "~bot/di/identifiers";
import IUserRepository from "~bot/interfaces/user-repository";

export const textProcessor = async (msg: Message) => {
  //console.log(msg); // TODO: remove

  const factory = container.get<interfaces.Factory<IStrategy<Message>>>(IDENTIFIERS.TEXT_STRATEGY_FACTORY);
  const userRepository = container.get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

  try {
    const { chat, text } = msg;

    const user = await userRepository.get(chat.id.toString());

    const strategy = factory(text) as IStrategy<Message>;

    await strategy.process({ user }, msg);
  } catch (e) {
    console.error("Text processor: ", e);
  }
};

export const callbackProcessor = async (msg: CallbackQuery) => {
  //console.log(msg); // TODO: remove

  const factory = container.get<interfaces.Factory<IStrategy<CallbackQuery>>>(IDENTIFIERS.CALLBACK_STRATEGY_FACTORY);
  const userRepository = container.get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

  try {
    const { from, data } = msg;

    const user = await userRepository.get(from.id.toString());

    const [left, right] = data.split("#");

    const command = right ? left : data;

    const strategy = factory(command) as IStrategy<CallbackQuery>;

    await strategy.process({ user }, msg);
  } catch (e) {
    console.error("Callback processor: ", e);
  }
};
