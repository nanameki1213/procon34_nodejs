import { Mode, Direction, ActionData } from './common';
import { setMode } from './navigator';

export class Input {
  mode: Mode;
  act: ActionData[] = [];
  isMyTurn: boolean = true;
  isReady: boolean = false;

  constructor() {
    this.mode = Mode.MOVE;

    this.load();
  }

  load() {
    setMode(this.mode);
  }

  enableMyTurn() {
    this.isMyTurn = true;
    const myturn = document.getElementById('myTurn');
    const opponent = document.getElementById('opponentTurn');
    if (!myturn) {
      return;
    }
    if (!opponent) {
      return;
    }
    myturn.style.display = 'block';
    opponent.style.display = 'none';
  }

  disableMyTurn() {
    this.isMyTurn = false;
    const myturn = document.getElementById('myTurn');
    const opponent = document.getElementById('opponentTurn');
    if (!myturn) {
      return;
    }
    if (!opponent) {
      return;
    }
    myturn.style.display = 'none';
    opponent.style.display = 'block';
  }
}