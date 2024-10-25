import { Mode, Direction, ActionData } from './common';
import { setMode } from './navigator';

export class Input {
  mode: Mode;
  act: ActionData[] = [];
  isReady: boolean = false;

  constructor() {
    this.mode = Mode.MOVE;

    this.load();
  }

  load() {
    setMode(this.mode);
  }
}