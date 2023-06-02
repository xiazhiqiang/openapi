export interface IDefaultWsProps<QUERY, PARAMETERS, MSG_DATA> {
  prefix?: string;
  url?: string;
  path?: string;
  extra?: any;
  query?: QUERY;
  parameters?: PARAMETERS;
  onOpen?: (p: IOnOpenProps) => void;
  onError?: (p: IOnErrorProps) => void;
  onClose?: (p: IOnCloseProps) => void;
  onMessage?: (p: IMessageProps<MSG_DATA>) => void;
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

export interface IMessageProps<DATA> {
  ws?: any;
  data?: DATA;
  msg?: {
    data?: DATA;
  };
}
