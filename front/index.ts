import * as Board from './board';
import { Input  } from './input';
import { Mode, Direction, ActionData } from './common';
import { fetchCSV, sendAction, notifyRoom} from './api';
import { setActionList, setReadyButton } from './navigator';

export let board: Board.Board = new Board.Board;
export let input: Input = new Input();

document.addEventListener('keydown', (event) => {
  if (input.isMyTurn === false) {
    return;
  }

  let mode: Mode;
  if ('a' <= event.key  && event.key <= 'z') {
    mode = Mode.MOVE;
  } else {
    mode = Mode.ACTION;
  }

  let direction: Direction;
  switch (event.key) {
    case 'w':
    case 'W':
      direction = Direction.UP;
      break;
    case 's':
    case 'S':
      direction = Direction.DOWN;
      break;
    case 'a':
    case 'A':
      direction = Direction.LEFT;
      break;
    case 'd':
    case 'D':
      direction = Direction.RIGHT;
      break;
    case 'q':
      direction = Direction.UpLEFT;
      break;
    case 'e':
      direction = Direction.UpRIGHT;
      break;
    case 'z':
      direction = Direction.DownLEFT;
      break;
    case 'x':
      direction = Direction.DownRIGHT;
      break;
    default:
      return;
  }

  if (!board) {
    return;
  }

  let action: ActionData = new ActionData;
  action.direction = direction;
  if (mode === Mode.ACTION) {
    if (!board.actionCurrentAgent(direction)) {
      return;
    }
    action.mode = Mode.ACTION;
  } else {
    if (!board.moveCurrentAgent(direction)) {
      return;
    }
    action.mode  = Mode.MOVE;
  }
  input.act[board.currentAgentIndex - 1] = action;
  setActionList(action);
  
  if (!board.nextCursor()) { // カーソルが最後であれば
    setReadyButton(input);
    input.disableMyTurn();
  }
  board.createBoard();

})

export const createBoard = async (boardKind: string) => {

  const path = '/api/field-datas/' + boardKind + '.csv';

  console.log('fetch from ' + path);

  // ボードをサーバから取得
  const CSVData = await fetchCSV(path);

  return CSVData;
}

// フロント側でボードを作成
export async function newGame() {
  const board_type = <HTMLInputElement>document.getElementById('board-type-select');
  const board_size = <HTMLInputElement>document.getElementById('board-size-select');

  console.log('board_type: ' + board_type.value);
  console.log('board_size: ' + board_size.value);

  const boardKind = board_type.value + board_size.value;

  // ボードの種類からボードを作成
  await board.loadBoard(boardKind, true);

  board.createBoard();
  console.log('draw board');

  input.enableMyTurn();

  // ルーム作成をemitする
  notifyRoom(boardKind);
}

const synchronizeAgent = () => {
  console.log(input.act);
  sendAction(input.act);

  board.setCursor(0);
  board.createBoard();
}

(window as any).newGame = newGame;
(window as any).synchronizeAgent = synchronizeAgent;