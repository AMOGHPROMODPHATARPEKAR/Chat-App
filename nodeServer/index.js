import express from "express"
import http from "http"
import {Server} from 'socket.io'
import cors from 'cors'


const app = express() // express app
app.use(cors)
const server = http.createServer(app) // http server
const io = new Server(server , {
    cors:{
        origin: '*',
        methods:["GET","POST"]
    }
}) // web socket server


const users = {};

io.on('connection',socket =>{

    socket.on('new-user-joined', name =>{
        console.log("new user ",name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]})
    });
  
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })

})

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});