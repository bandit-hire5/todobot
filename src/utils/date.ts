import { DateTime } from "luxon";

export const getUnixTimestampFromDate = (date: Date): number => Math.round(date.getTime() / 1000);

export const getCurrentUnixTimestamp = (): number => getUnixTimestampFromDate(new Date());

export const getDateFromUnixTimestamp = (timestamp: number): Date => new Date(timestamp * 1000);

export const addSecondsToDate = (date: Date, seconds: number): Date => {
  return new Date(date.getTime() + seconds * 1000);
};

export const scheduleDateByTimestamp = (timestamp: number, minSeconds = 0): Date => {
  const currentDate = new Date();
  let scheduleDate = new Date(timestamp * 1000);

  if (scheduleDate < currentDate) {
    scheduleDate = addSecondsToDate(currentDate, minSeconds);
  }

  return scheduleDate;
};

export const formatDate = (date: Date, format: string) => {
  const dateTime = DateTime.fromJSDate(date).setLocale("en");

  return dateTime.toFormat(format);
};

export const convertTime = (time: string) => {
  const [first, second] = time.split(":");

  return `${first}:${second}`;
};

export const formatTimestamp = (timestamp: number, format: string) => {
  return formatDate(getDateFromUnixTimestamp(timestamp), format);
};
