import { Socket } from 'socket.io-client';

export interface GadgetContext {
  currentQ: any;
  setEliminatedOptions: (options: string[]) => void;
  setTimer: (updater: (prev: number) => number) => void;
  socket: Socket | null;
  opponent: any;
  localUser: any;
  consumeItem: (item: any) => void;
}

export interface IGadgetStrategy {
  execute(context: GadgetContext): void;
}
