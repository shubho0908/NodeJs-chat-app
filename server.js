var express = require("express");
const cors = require("cors");
var app = express();
app.use(cors());
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var server_port = process.env.PORT || 5000;

app.use("/scripts", express.static(__dirname + "/node_modules/"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "index.html");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("New user joined", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(server_port, function () {
  console.log("localhost:" + server_port);
});
