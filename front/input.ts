import { Mode, Direction, ActionData } from './common';

export class Input {
  act: ActionData[] = [];
  isMyTurn: boolean = true;
  isReady: boolean = false;


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