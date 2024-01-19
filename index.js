const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  addTrailingSlash: false,
  cors: { origin: "*" },
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Socket io server running",
  });
});

let sequenceNumberByClient = new Map();
io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  socket.on("scrapp-completed", () => {
    io.emit("scrap-next");
  });
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// event fired every time a new client connects:
//server.on("connection", (socket) => {
//
//});
