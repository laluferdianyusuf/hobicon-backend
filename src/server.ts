import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger";

import v1Router from "./routes/index";
import { setupRedisSubscriber } from "./events/redis.subscriber";

const port = process.env.PORT || 2111;
const socketPort = process.env.SOCKET_PORT || 2112;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api-docs",
  swaggerUiMiddleware.serve,
  swaggerUiMiddleware.setup(swaggerSpec)
);

app.use("/", v1Router);

app.get("/", (req, res) => res.send({ message: "Server is running" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

setupRedisSubscriber(io);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

server.listen(socketPort, () => {
  console.log(
    `Server with Socket.IO running on http://localhost:${socketPort}`
  );
});
