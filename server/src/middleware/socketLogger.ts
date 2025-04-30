import { Socket } from "socket.io";

export function socketLogger(socket: Socket, next: (err?: any) => void) {
  socket.use(([event, ...args], next) => {
    console.log(
      `[${new Date().toLocaleString()}] Socket ${event}: ${JSON.stringify(
        args
      )}`
    );
    next();
  });
  next();
}

export default socketLogger;
