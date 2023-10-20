import AppError from "~src/models/error";
import { ERRORS } from "~src/interfaces/app/app";

const catchDatabaseErrors = async <RequestMessage, ResponseMessage>(
  handler: (msg: RequestMessage) => Promise<ResponseMessage>,
  msg: RequestMessage
): Promise<ResponseMessage> => {
  try {
    return await handler.call(this, msg);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = e as any;

    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError(ERRORS.DUPLICATE_ENTRY, error.sqlMessage);
    }

    throw e;
  }
};

export const catchDatabaseErrorsDecorator =
  <RequestMessage, ResponseMessage>(handler: (msg: RequestMessage) => Promise<ResponseMessage>) =>
  (msg: RequestMessage) =>
    catchDatabaseErrors(handler, msg);
