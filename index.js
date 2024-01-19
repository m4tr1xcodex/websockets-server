const { Server } = require("socket.io");
const express = require("express");
const app = express();
const WEB_PORT = 3001;
const PORT = 3000;
const server = new Server({
  addTrailingSlash: false,
  cors: { origin: "*" },
}).listen(PORT);

let sequenceNumberByClient = new Map();

// event fired every time a new client connects:
server.on("connection", (socket) => {
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
console.log(`Socket is started at port: ${PORT}`);

//EXPRESS APP
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: `Websocket seerver running on port:${PORT}`,
  });
});
app.listen(WEB_PORT, () => {
  console.log(`Example app listening on port ${WEB_PORT}`);
});
