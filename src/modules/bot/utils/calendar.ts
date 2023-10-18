import { InlineKeyboardButton } from "node-telegram-bot-api";
import { EMPTY_CALENDAR_SPOT } from "~bot/constants";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getNumDayOfWeek = (date: Date) => {
  const day = date.getDay();

  return day === 0 ? 6 : day - 1;
};

const getDays = (year: number, month: number): string[][] => {
  const d = new Date(year, month);

  const days: string[][] = [];

  days[days.length] = [];

  for (let i = 0; i < getNumDayOfWeek(d); i++) {
    days[days.length - 1].push(EMPTY_CALENDAR_SPOT);
  }

  while (d.getMonth() === +month) {
    days[days.length - 1].push(d.getDate().toString());

    if (getNumDayOfWeek(d) % 7 === 6) {
      days[days.length] = [];
    }

    d.setDate(d.getDate() + 1);
  }

  if (getNumDayOfWeek(d) !== 0) {
    for (let i = getNumDayOfWeek(d); i < 7; i++) {
      days[days.length - 1].push(EMPTY_CALENDAR_SPOT);
    }
  }

  return days;
};

const setBeforeZero = (num: string): string => {
  return ("0" + num).slice(-2);
};

export const getCalendarData = (year: number, month: number): InlineKeyboardButton[][] => {
  const dayLines = getDays(year, month);

  const currentMonthDate = new Date(+year, +month);

  const prevMonthDate = new Date(new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() - 1));

  const nextMonthDate = new Date(new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() + 1));

  const currentInfo = `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`;
  const current_info = `${currentMonthDate.getFullYear()}-${setBeforeZero(
    (currentMonthDate.getMonth() + 1).toString()
  )}`;

  const buttons: InlineKeyboardButton[][] = [];

  buttons.push([
    {
      text: currentInfo,
      callback_data: "ignore",
    },
  ]);

  buttons.push(
    ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"].map((text) => ({
      text,
      callback_data: "ignore",
    }))
  );

  dayLines.forEach((line) => {
    buttons[buttons.length] = [];

    line.forEach((day) => {
      buttons[buttons.length - 1].push({
        text: day === EMPTY_CALENDAR_SPOT ? EMPTY_CALENDAR_SPOT : setBeforeZero(day),
        callback_data:
          day === EMPTY_CALENDAR_SPOT ? "ignore" : "calendar-select#" + current_info + "-" + setBeforeZero(day),
      });
    });
  });

  buttons.push([
    {
      text: "Prev",
      callback_data: "calendar-slice#" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: " ",
      callback_data: "ignore",
    },
    {
      text: "Next",
      callback_data: "calendar-slice#" + nextMonthDate.getFullYear() + "_" + nextMonthDate.getMonth(),
    },
  ]);

  return buttons;
};
