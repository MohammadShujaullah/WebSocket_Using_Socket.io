// connect to server
const socket = io();

// ask nickname
const nickname = prompt("Enter your nickname");
socket.emit("set-nickname", nickname);

const chatdiv = document.getElementById('chat');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');


socket.on("user-joined", (name) => {
    const info = document.createElement('p');
    info.textContent = `🔵 ${name} joined the chat`;
    info.style.color = "green";
    chatdiv.appendChild(info);
});


socket.on("user-left", (name) => {
    const info = document.createElement('p');
    info.textContent = `🔴 ${name} left the chat`;
    info.style.color = "red";
    chatdiv.appendChild(info);
});


socket.on('message', (msg) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = msg;
    chatdiv.appendChild(messageElement);
});


sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message === "") return;   // prevent empty messages

    // emits means send kro,   abb mai ise backend main bhi receive kr skta hu,
    //   (chat message) event ke through,  aur message data ke sath
    socket.emit('chat message', message);

    messageInput.value = '';   // send krne k bad input field ko clear kr do


})

