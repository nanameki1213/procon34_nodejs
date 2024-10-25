import { io } from 'socket.io-client'
import { ActionData } from './common'

const socket = io();

function ActionAgent(actionData: ActionData) {
  socket.emit('ActionAgent', actionData);
}

socket.on('AgentAction', (actionData) => {
  
})