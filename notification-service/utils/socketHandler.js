const { Server } = require("socket.io");
const { sendNotification } = require("../utils/kafkaProducer");
const {
  startNotificationEventConsumer,
} = require("../events/notificationEventConsumer");

const onlineUsers = new Map();
const socketToUsers = new Map();

const putSocket = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
  socketToUsers.set(socketId, userId);
};

async function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected ", socket.id);
    socket.on("join", async ({ userId, socketId }) => {
      putSocket(userId, socketId);
      console.log("onlineUsers", onlineUsers);
    });

    socket.on("notification", async (event) => {
      console.log("notification received to ", socket.id);
      event.receiverId = socketToUsers.get(socket.id);
      await sendNotification(event);
      console.log("notification sent");
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("user disconnected ", socket.id);
    });
  });

  await startNotificationEventConsumer(io, onlineUsers);

  return io;
}

module.exports = { initializeSocket, onlineUsers };
