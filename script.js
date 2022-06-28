const socket = io("http://localhost:5000");
let sent = new Audio("sent.mp3");
let recieve = new Audio("recieve.mp3");

let mssg_body = document.querySelector(".message-body");
let send_box = document.getElementById("send-box");
let Message = document.getElementById("message");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("join");
  messageElement.classList.add(position);
  mssg_body.append(messageElement);
};

const appendMessage = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("mssg");
  messageElement.classList.add(position);
  mssg_body.append(messageElement);
};

send_box.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = Message.value;
  if (message == "") {
    alert(`You can't send an empty message.`);
  } else {
    sent.play();
    appendMessage(`You: ${message}`, "right");
    socket.emit("send", message);
    Message.value = "";
  }
});

const name = prompt("Enter your name to join the chat");
socket.emit("new-user-joined", name);

socket.on("user-joined", (data) => {
  append(`${data} joined the chat`, "right");
});

socket.on("receive", (data) => {
  recieve.play();
  appendMessage(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});
