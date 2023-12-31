const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => res.send("hello world"));

require("./game.controller.js")(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
