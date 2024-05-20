import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class IoServer{
    constructor() {
        this.io = new Server({cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
          }});
        this.userSocketMap = new Map();

        this.io.on('connection', (socket) => {
            socket.on('authenticate', (token) => {
                try {
                    const user = jwt.verify(token, SECRET_KEY);
                    this.userSocketMap.set(user.id, socket.id);
                } catch (error) {
                    socket.disconnect();
                }
            });
        
            socket.on('disconnect', () => {
               this.userSocketMap.delete(this.getBySocketId(socket.id));
            });
        });        
    }

    sendMessage(event, message, userId){
        const socketId = this.userSocketMap.get(userId);
        if(!socketId){
            return;
        }
        this.io.to(socketId).emit(event, message);
    }

    attach(server){
        this.io.attach(server);
    }

    getBySocketId(socketId) {
        for (let [key, value] of this.userSocketMap.entries()) {
          if (value === socketId)
            return key;
        }
      }
}

const ioServer = new IoServer();

export {ioServer}