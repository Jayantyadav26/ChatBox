import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  users.add(socket.id);

  socket.on("chat message", (data) => {
    console.log(`${data.user}: ${data.message}`);
    io.emit("chat message", data);
  });

  socket.on("join-voice", () => {
    const otherUsers = Array.from(users).filter((id) => id !== socket.id);
    socket.emit("all-users", otherUsers);
  });

  socket.on("voice signal", ({ to, signal }) => {
    io.to(to).emit("voice signal", { from: socket.id, signal });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    users.delete(socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Chat server is running");
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
