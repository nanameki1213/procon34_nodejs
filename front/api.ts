import { io } from 'socket.io-client'
import { board, input } from './index'
import { ActionData } from './common';

const socket = io('http://localhost:3000');

export const fetchCSV = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if(!response.ok) {
    throw new Error('response error');
  }
  const CSVData = await response.text();

  console.log(CSVData);

  return CSVData;
}

export const sendAction = (act: ActionData[]) => {
  socket.emit('AgentAction', act);
  return true;
}

export const notifyRoom = (boardKind: string) => {
  console.log('room created.');
  socket.emit('roomCreated', boardKind);
}

// 相手がルームを作成した
socket.on('roomCreated', async (roomId, boardKind) => {
  console.log('room has created.');
  if (!confirm('対戦を申し込まれました。ゲームを開始しますか？')) {
    alert('対戦申し込みを拒否しました。');
  }
  await board.loadBoard(boardKind, false);
  board.createBoard();
  input.disableMyTurn();
});

socket.on('AgentAction', (ActionData) => {
  console.log('receive AgentAction');
  board.synchronizeOpponent(ActionData);
  input.enableMyTurn();
});