import { io } from 'socket.io-client'
import { createBoard, input } from './index'
import { board } from './index'
import { Board } from './board';

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

export const sendAction = () => {
  socket.emit('AgentAction', input.act);
  return true;
}

export const notifyRoom = (boardKind: string) => {
  console.log('room created.');
  socket.emit('roomCreated', boardKind);
}

// 相手がルームを作成した
socket.on('roomCreated', async (roomId, boardKind) => {
  console.log('room has created.');
  await board.loadBoard(boardKind, false);
  board.createBoard();
});

socket.on('ActionAgent', (ActionData) => {
  
});