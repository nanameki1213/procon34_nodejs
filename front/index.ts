import * as Board from './board';
import { Input  } from './input';
import { Mode, Direction, ActionData } from './common';
import { fetchCSV, sendAction} from './api';
import { setActionList, setReadyButton } from './navigator';

let board: Board.Board;
export let input: Input = new Input();

document.addEventListener('keydown', (event) => {
  if (event.key === 'm') {
    input.mode = (input.mode == Mode.MOVE) ? Mode.ACTION : Mode.MOVE;
    input.load();
    return;
  }

  let direction: Direction;
  switch (event.key) {
    case 'w':
      direction = Direction.UP;
      break;
    case 's':
      direction = Direction.DOWN;
      break;
    case 'a':
      direction = Direction.LEFT;
      break;
    case 'd':
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
  if (input.mode === Mode.ACTION) {
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
  }
  board.createBoard();

})

export async function fetch_board() {
  const board_type = <HTMLInputElement>document.getElementById('board-type-select');
  const board_size = <HTMLInputElement>document.getElementById('board-size-select');

  console.log('board_type: ' + board_type.value);
  console.log('board_size: ' + board_size.value);

  const path = '/api/field-datas/' + board_type.value + board_size.value + '.csv';

  console.log('fetch from ' + path);

  // ボードをサーバから取得
  const CSVData = await fetchCSV(path);

  // ボードを作成
  board = new Board.Board(CSVData, true);
  board.createBoard();
}

(window as any).fetch_board = fetch_board;