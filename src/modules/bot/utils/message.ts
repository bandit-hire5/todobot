import { Message as IMessage } from "~bot/interfaces/app";
import { NoteFull as INoteFull } from "~src/interfaces/entity/note";

export const welcomeMessage = (): IMessage => {
  return {
    text: `👋 Hello! This is a todo notes helper`,
    parseMode: "HTML",
  };
};

export const selectActionMessage = (): IMessage => {
  return {
    text: `⚡️Select an action:`,
    parseMode: "HTML",
  };
};

export const enterNoteTextMessage = (): IMessage => {
  return {
    text: `⚡️Enter note text`,
    parseMode: "HTML",
  };
};

export const calendarMessage = (): IMessage => {
  return {
    text: `<b>Calendar:</b>`,
    parseMode: "HTML",
  };
};

export const enterTimeMessage = (): IMessage => {
  return {
    text: `⚡️Enter time in format: 09:20`,
    parseMode: "HTML",
  };
};

export const enterCorrectTimeMessage = (): IMessage => {
  return {
    text: `⚡️Enter correct time in format: 09:20`,
    parseMode: "HTML",
  };
};

export const noteAddedMessage = (note: INoteFull): IMessage => {
  return {
    text: `👋 Note has been successfully added\n\n${note.text}`,
    parseMode: "HTML",
    buttons: [
      [
        {
          text: "Remove",
          callback_data: `remove#${note.id}`,
        },
      ],
    ],
  };
};

export const listItemMessage = (note: INoteFull): IMessage => {
  return {
    text: `🕜 ${note.text}`,
    parseMode: "HTML",
    buttons: [
      [
        {
          text: "Remind later",
          callback_data: `remind-later#${note.id}`,
        },
        {
          text: "Done",
          callback_data: `done#${note.id}`,
        },
      ],
    ],
  };
};

export const delimiterMessage = (): IMessage => {
  return {
    text: `///////////////////////////////////////////////////////////\n//////////////////*** TODO LIST ***/////////////////\n///////////////////////////////////////////////////////////`,
    parseMode: "HTML",
  };
};

export const emptyListMessage = (): IMessage => {
  return {
    text: `😭 You have nothing to do...`,
    parseMode: "HTML",
  };
};
