const { Server } = require("socket.io");
const axios = require("axios");
const {
  startNotificationEventConsumer,
} = require("../events/notificationEventConsumer");
const notificaiontService = require("../services/notificationService");

const onlineUsers = new Map();
const socketToUsers = new Map();

const getNames = async (senderEmail, receiverEmail) => {
  try {
    const senderResponse = await axios.get(
      `http://localhost:${process.env.USER_SERVICE_PORT}/users/email/${senderEmail}`
    );
    console.log("senderResponse", senderResponse);
    const senderName = senderResponse.data.data.name;

    const receiverResponse = await axios.get(
      `http://localhost:${process.env.USER_SERVICE_PORT}/users/email/${receiverEmail}`
    );

    console.log("receiverResponse", receiverResponse);
    const receiverName = receiverResponse.data.data.name;

    return { senderName, receiverName };
  } catch (err) {
    console.log(err);
  }
};

const putSocket = (userEmail, socketId) => {
  onlineUsers.set(userEmail, socketId);
  socketToUsers.set(socketId, userEmail);
};

async function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected ", socket.id);
    io.to(socket.id).emit("connection", { socketId: socket.id });
    socket.on("join", async ({ userEmail, socketId }) => {
      putSocket(userEmail, socketId);
      console.log("onlineUsers", onlineUsers);
    });

    socket.on("notification", async (event) => {
      console.log("notification received to ", socket.id, event);
      try {
        const { senderName, receiverName } = await getNames(
          event.senderEmail,
          event.receiverEmail
        );
        if (!senderName || !receiverName) {
          console.log("Failed to fetch names");
          return;
        }
        event.senderName = senderName;
        event.receiverName = receiverName;
        await notificaiontService.createNotification(event);

        const { receiverEmail } = event;
        if (receiverEmail && onlineUsers.has(receiverEmail)) {
          const socketId = onlineUsers.get(receiverEmail);
          io.to(socketId).emit("notification", event);
          console.log("notification sent to the reciever");
        } else {
          console.log("User not online");
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      for (const [userEmail, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userEmail);
          break;
        }
      }
      console.log("onlineUsers", onlineUsers);
      console.log("user disconnected ", socket.id);
    });
  });

  await startNotificationEventConsumer();

  return io;
}

module.exports = { initializeSocket };
