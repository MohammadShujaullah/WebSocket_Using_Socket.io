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

const users = {};    // socket.id -> nickname


//backend main connect hota hai client, to "connections" event trigger hota ha 
io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    // client will send nickname after connecting
    socket.on("join", (username) => {
        users[socket.id] = username;

        console.log(username + " joined with id " + socket.id);

        io.emit("online-users", Object.values(users));

        // notify others
        socket.broadcast.emit("user-joined", username);
    });


    // receive message from a client
    socket.on("chat message", (msg) => {

        const nickname = users[socket.id];

        // user might send before nickname is set
        if (!nickname) return;

        // broadcast to everyone
        io.emit("message", `${nickname}: ${msg}`);
    });






    // client   after disconnection, will automatically trigger "disconnect" event on server

    socket.on("disconnect", () => {

    const username = users[socket.id];

    console.log("User disconnected:", socket.id);

    if (username) {
        socket.broadcast.emit("user-left", username);
        delete users[socket.id];
    }

    io.emit("online-users", Object.values(users));
});

});

// socket.broadcast.emit --->    // everyone except sender

server.listen(PORT, () => {
    console.log("server is running successfully on port " + PORT);
});