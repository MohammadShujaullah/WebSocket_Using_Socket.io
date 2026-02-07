import http from "http";
import express from "express";
import path from "path";
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const PORT = 9000;

const io = new Server(server);

// serve static files from "public" directory
app.use(express.static("public"));

const __dirname = path.resolve();




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const users = new Map();   // socket.id -> nickname

io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    // client will send nickname after connecting
    socket.on("set-nickname", (nickname) => {

        users.set(socket.id, nickname);

        console.log(`${nickname} joined`);

        // tell others (not sender)
        socket.broadcast.emit("user-joined", nickname);

        // send updated online users list to everyone
        io.emit("online-users", Array.from(users.values()));
    });


    // receive message from a client
    socket.on("chat message", (msg) => {

        const nickname = users.get(socket.id);

        // user might send before nickname is set
        if (!nickname) return;

        // broadcast to everyone
        io.emit("message", `${nickname}: ${msg}`);
    });






    // client   after disconnection, will automatically trigger "disconnect" event on server

    socket.on("disconnect", () => {

        const nickname = users.get(socket.id);

        if (!nickname) return;

        users.delete(socket.id);

        console.log(`${nickname} left`);

        socket.broadcast.emit("user-left", nickname);

        io.emit("online-users", Array.from(users.values()));
    });
});

// socket.broadcast.emit --->    // everyone except sender

server.listen(PORT, () => {
    console.log("server is running successfully on port " + PORT);
});