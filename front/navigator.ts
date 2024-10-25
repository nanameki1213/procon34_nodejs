import { input } from '.';
import { Direction, Mode } from './common'
import { ActionData } from './common';
import { Input } from './input';

export const clearActionList = () => {
  const actionList = document.getElementById('actionList');
  if (!actionList) {
    return;
  }
  actionList.innerHTML = '';
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

export const unsetReadyButton = () => {
  const msg = document.getElementById('readyMsg');
  if (!msg) {
    return;
  }
  msg.style.display = 'none';
  input.isReady = false;
}

export const setReadyButton = (input: Input) => {
  const msg = document.getElementById('readyMsg');
  if (!msg) {
    return;
  }
  msg.style.display = 'block';
  input.isReady = true;
}