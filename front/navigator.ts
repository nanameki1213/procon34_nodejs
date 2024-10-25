import { Direction, Mode } from './common'
import { ActionData } from './common';
import { Input } from './input';

export const setMode = (mode: Mode) => {
  const m = document.getElementById('mode');
  
  if (!m) {
    console.error('mode is not found.');
    return;
  }

  let current_mode = Mode.MOVE;
  if (m.classList.contains('action')) {
    current_mode = Mode.ACTION;
  }

  if (mode != current_mode) {
    if (mode == Mode.MOVE) {
      m.classList.remove('action');
      m.classList.add('move');
      m.innerText = 'MOVE';
    } else {
      m.classList.remove('move');
      m.classList.add('action');
      m.innerText = 'ACTION';
    }
  }
}

export const setActionList = (actionData: ActionData) => {
  const actionList = document.getElementById('actionList');

  if (!actionList) {
    console.error('actionList is not found.');
    return;
  }

  const action = document.createElement('li');
  if (actionData.mode == Mode.MOVE) {
    action.classList.add('actionlist-move');
  } else {
    action.classList.add('actionlist-action');
  }

  action.innerText = '→';
  switch (actionData.direction) {
    case Direction.UP:
      action.classList.add('actionlist-up');
      break;
    case Direction.DOWN:
      action.classList.add('actionlist-down');
      break;
    case Direction.LEFT:
      action.classList.add('actionlist-left');
      break;
    case Direction.RIGHT:
      action.classList.add('actionlist-right');
      break;
    case Direction.UpLEFT:
      action.classList.add('actionlist-upleft');
      break;
    case Direction.UpRIGHT:
      action.classList.add('actionlist-upright');
      break;
    case Direction.DownLEFT:
      action.classList.add('actionlist-downleft');
      break;
    case Direction.DownRIGHT:
      action.classList.add('actionlist-downright');
      break;
  }

  actionList.appendChild(action);
}

export const setReadyButton = (input: Input) => {
  const msg = document.getElementById('readyMsg');
  if (!msg) {
    return;
  }
  msg.style.display = 'block';
  input.isReady = true;
}