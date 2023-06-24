export interface IDefaultWsProps<QUERY, PARAMETERS, MESSAGE_DATA> {
  prefix?: string;
  url?: string;
  path?: string;
  extra?: any;
  query?: QUERY;
  parameters?: PARAMETERS;
  onOpen?: (p: IOnOpenProps) => void;
  onError?: (p: IOnErrorProps) => void;
  onClose?: (p: IOnCloseProps) => void;
  onMessage?: (p: IMessageProps<MESSAGE_DATA>) => void;
}

export interface IOnOpenProps {
  ws?: any;
  [k: string]: any;
}

export interface IOnErrorProps {
  ws?: any;
  error?: any;
  [k: string]: any;
}

export interface IOnCloseProps {
  ws?: any;
  event?: any;
  [k: string]: any;
}

export interface IMessageProps<MESSAGE_DATA> {
  ws?: any;
  data?: MESSAGE_DATA;
  msg?: {
    data?: MESSAGE_DATA;
  };
  [k: string]: any;
}

export interface IWsOnOpen {
  (p: IDefaultWsProps<any, any, any> & IOnOpenProps): any;
}

export interface IWsOnClose {
  (p: IDefaultWsProps<any, any, any> & IOnCloseProps): any;
}

export interface IWsOnError {
  (p: IDefaultWsProps<any, any, any> & IOnErrorProps): any;
}

export interface IWsOnMessage {
  (p: IDefaultWsProps<any, any, any> & IMessageProps<any>): any;
}
