import IContext from "~bot/interfaces/app";

export default interface Strategy<MsgType> {
  process(context: IContext, msg: MsgType): Promise<void>;
}
