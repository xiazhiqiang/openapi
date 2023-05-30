export interface IDefaultRequestProps {
  prefix?: string;
  url?: string;
  path?: string;
  extra?: any;
  onOpen?: (p: IOnOpenProps) => void;
  onError?: (p: IOnErrorProps) => void;
  onClose?: (p: IOnCloseProps) => void;
  onMessage?: (p: IOnMessageProps<any>) => void;
  [k: string]: any;
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

export interface IOnMessageProps<DATA> {
  ws?: any;
  msg?: {
    data?: DATA | any;
    [k: string]: any;
  };
  data?: DATA | any;
  [k: string]: any;
}
