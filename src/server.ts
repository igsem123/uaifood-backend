import http from "http";
import app from "./app";
import config from "./config/config";
import { initSocket } from "./config/socket";

const port = config.port;
const httpServer = http.createServer(app);

const io = initSocket(httpServer); // inicializa socket.io

httpServer.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

export { io };