import express from "express";
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN?.split(","),
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket'], 
});

app.get('/', (req, res) => {
    res.send('Render Socket Server is Running!');
});

app.post('/api/trigger-event', (req, res) => {
    const { event, data } = req.body;

    io.emit(event, data);
    
    console.log(`Emitted event: ${event}`);
    res.status(200).send('Event emitted');
});

io.on('connection', (socket) => {
    console.log('✅ A user connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Socket.IO server listening on port ${process.env.PORT}`);
})