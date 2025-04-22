import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (good for development)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("chat message", (data) => {
    // Expected: { user: "Alice", message: "Hello!" }
    console.log(`${data.user}: ${data.message}`);
    io.emit("chat message", data); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Chat server is running");
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
