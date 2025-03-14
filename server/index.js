const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const {
  uploadImageMidleware,
} = require("./middlewares/upload/uploadImage.middleware");
const { uploadImageWebsite } = require("./controller/uploadImage.controller");
const {
  uploadFileMiddleware,
} = require("./middlewares/upload/uploadFile.middleware");
const { uploadFileWebsite } = require("./controller/uploadFile.controler");
const path = require("path");
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/image/web", uploadImageMidleware, uploadImageWebsite);
app.post("/file/web", uploadFileMiddleware, uploadFileWebsite);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Địa chỉ của React FE
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users_online = [];

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  // add user connected
  socket.on("user_connected", (data) => {
    const user = users_online.find((item) => item.user_id === socket.id);
    if (!user) {
      users_online.push({
        user_id: String(socket.id),
        name: data.name,
        address: data.address,
        avatar: `https://randomuser.me/api/portraits/women/2.jpg`,
        online: true,
      });
      // sent info to user login only
      socket.emit("userInfo", users_online[users_online.length - 1]);
      io.emit("user_join_last", users_online[users_online.length - 1]);
    }
    // console.log("getOnlineUsers", users_online);
    io.emit("getOnlineUsers", users_online);
  });

  // io.emit sent to all users connected client
  io.emit("getOnlineUsers", users_online);

  // send text / image / file message
  socket.on(
    "send_message",
    ({ sender_id, receiver_id, text, image, file, filename }, callback) => {
      const receiverSocket = users_online.find(
        (user) => user.user_id == receiver_id
      );
      const receiverSocketId = receiverSocket?.user_id;

      const senderSocket = users_online.find(
        (user) => user.user_id == sender_id
      );
      const senderSocketId = senderSocket?.user_id;

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          message_id: String(Date.now()),
          sender_id: String(senderSocketId),
          receiver_id: String(receiverSocketId),
          text: text,
          image: image,
          file: file,
          filename: filename,
          time: String(Date.now()),
          sender_info: senderSocket,
          receiver_info: receiverSocket,
          status: true,
        });
        callback({ status: true }); // Xác nhận với client
      } else {
        // io.to(senderSocketId).emit({
        //   status: false,
        //   text: "Người nhận hiện không online!",
        // });
        callback({ status: false });
      }
    }
  );

  // Khi user gõ phím, gửi "typing" đến đúng người nhận
  socket.on("typing", ({ sender_id, receiver_id }) => {
    const receiverSocket = users_online.find(
      (user) => user.user_id == receiver_id
    );
    const receiverSocketId = receiverSocket?.user_id;

    const senderSocket = users_online.find((user) => user.user_id == sender_id);
    const senderSocketId = senderSocket?.user_id;
    if (receiverSocketId && senderSocketId) {
      io.to(receiverSocketId).emit("typing", senderSocket);
    }
  });

  // Khi user dừng gõ, gửi "stopTyping" đến đúng người nhận
  socket.on("stopTyping", ({ sender_id, receiver_id }) => {
    const receiverSocket = users_online.find(
      (user) => user.user_id == receiver_id
    );
    const receiverSocketId = receiverSocket?.user_id;

    const senderSocket = users_online.find((user) => user.user_id == sender_id);
    const senderSocketId = senderSocket?.user_id;
    if (receiverSocketId && senderSocketId) {
      io.to(receiverSocketId).emit("stopTyping", senderSocket);
    }
  });

  // Ngắt kết nối
  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id);
    users_online = users_online.filter((item) => item.user_id !== socket.id);
    io.emit("getOnlineUsers", users_online);
  });
});

server.listen(7000, () => console.log("Server chạy trên cổng 7000"));
