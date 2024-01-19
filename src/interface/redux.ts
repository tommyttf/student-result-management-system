export interface IMessage {
  isShow: boolean;
  isError: boolean;
  message: string;
}

export interface IReduxStore {
  message: IMessage;
}
