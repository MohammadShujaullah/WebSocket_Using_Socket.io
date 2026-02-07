import http from "http";
import express from "express";
import path from "path";
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const PORT = 9000;

const io = new Server(server);

const __dirname = path.resolve();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {

    console.log("a user is connected", socket.id);
    socket.on("chat message", mg => {// agr front end se (chat message) atta ha, to emit krdo
        io.emit("message", mg);      // phle ham console.log kr rhe the , lekin hme to sabhi client ko bhejna ha , so io.emit krna hoga
        // specially io.emit is used to send everyone(including sender)
    })


});

// socket.broadcast.emit --->    // everyone except sender

server.listen(PORT, () => {
    console.log("server is running successfully on port " + PORT);
});