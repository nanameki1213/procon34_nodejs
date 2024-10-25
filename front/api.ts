import { io } from 'socket.io-client'
import { input } from './index'

const socket = io();

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

socket.on('ActionAgent', (ActionData) => {
  
})