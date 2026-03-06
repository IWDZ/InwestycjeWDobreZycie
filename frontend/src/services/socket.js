import { io } from 'socket.io-client'

const HOST = "localhost"
const PORT = 3000;

const socket = io(`http://${HOST}:${PORT}`)

export default socket