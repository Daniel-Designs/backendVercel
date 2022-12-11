require("dotenv").config();
const express = require("express");
const cors = require("cors");
const exerciseResultRouter = require("./routes/exerciseResults");
const usersRouter = require("./routes/user");
const exercisesRouter = require("./routes/exercise");
const loginRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const loginAdminRouter = require("./routes/authAdmin");
const pusher = require("./routes/pusher");
const callRouter = require("./routes/call");
const audioRouter = require("./routes/audio");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/messages");
const noteRouter = require("./routes/note");
const transcriptRouter = require("./routes/transcript");
const http = require("http");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/exerciseResults", exerciseResultRouter);
app.use("/exercises", exercisesRouter);
app.use("/login", loginRouter);
app.use("/admin", adminRouter);
app.use("/loginAdmin", loginAdminRouter);
app.use("/pusher", pusher);
app.use("/calls", callRouter);
app.use("/chat", chatRouter);
app.use("/msg", messageRouter);
app.use("/note", noteRouter);
app.use("/audio", audioRouter);
app.use("/transcript", transcriptRouter);

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let users = {};

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("connected", (userName) => {
    // add user data on connection
    if (userName) {
      users[userName] = socket.id;
      console.log(users, "connected");
    }
  });

  socket.on(
    "callUser",
    ({ userToCall, signalData, from, fromName, callID }) => {
      io.to(users[userToCall]).emit("callUser", {
        signal: signalData,
        from,
        fromName,
        callID,
      });
      console.log(from, "calling", userToCall);
    }
  );

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
    socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
    console.log(
      Object.keys(users).find((user) => users[user] === socket.id),
      "updating",
      type,
      ":",
      currentMediaStatus
    );
  });

  socket.on("msgUser", ({ to, msg, sender }) => {
    io.to(users[to]).emit("msgRcv", { msg, sender });
    console.log(sender, "sends msg:", msg, "to:", to);
  });

  socket.on("answerCall", (data) => {
    socket.broadcast.emit("updateUserMedia", {
      type: data.type,
      currentMediaStatus: data.myMediaStatus,
    });
    io.to(users[data.to]).emit("callAccepted", data);
    console.log(
      Object.keys(users).find((user) => users[user] === socket.id),
      "accepted call"
    );
  });

  socket.on("declineCall", ({ to }) => {
    io.to(users[to]).emit("declineCall");
    console.log(
      Object.keys(users).find((user) => users[user] === socket.id),
      "declined call"
    );
  });

  socket.on("endCall", ({ to }) => {
    io.to(users[to]).emit("endCall");
    console.log(
      Object.keys(users).find((user) => users[user] === socket.id),
      "ended call"
    );
  });

  socket.on("disconnect", () => {
    //remove user data from users object when a socket disconnects
    for (user in users) {
      if (user === socket.id) delete users[user];
    }
    console.log(users, "disconnected");
  });
});

module.exports = server;
