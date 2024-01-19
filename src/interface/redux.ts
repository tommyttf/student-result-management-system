export interface IMessage {
  isShow: boolean;
  message: string;
}

export interface IReduxStore {
  message: IMessage;
}
