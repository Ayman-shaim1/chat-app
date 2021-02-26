const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const connectDB = require("./Config/db");
const ChatRoute = require("./Routes/Chat.Route");
const AuthRoute = require("./Routes/Auth.Route");
const MessageRoute = require("./Routes/Message.Route");
const RT = require("./RealTime/index");
const { checkUser } = require("./Middlewares/Auth.Middleware");
dotenv.config();
connectDB();

// CONFIG VIEWS :
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
// MIDDLEWARES :
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.use(expressLayouts);
app.use(cookieParser());
//ROUTES :
app.get("*", checkUser);
app.use("/", ChatRoute);
app.use("/", AuthRoute);
app.use("/", MessageRoute);

/*                                       [SOCKET IO]                               */
// Socket connection :
io.on("connection", (socket) => {
  // User connect :
  socket.on("userConnect", (email) => {
    RT.user_connect(email);
    socket.email = email;
    io.emit("client-user-connect",email);
  });
  socket.on("send-message", (message) => {
    RT.send_message(message, () => {
      io.emit("receive-message", message);
    });
  });
  socket.on("userTyping", ({ senderUser, receivedUser }) => {
    io.emit("client-user-typing", { senderUser, receivedUser });
  });
  socket.on("userStopTyping", ({ senderUser, receivedUser }) => {
    io.emit("client-user-stop-typing", { senderUser, receivedUser });
  });

  socket.on("seenMessage",({connectedUser_email,otherUser}) => {
    io.emit("client-seen-message",{connectedUser_email,otherUser});
  });

  // Socket disconnect :
  socket.on("disconnect", () => {
    io.emit("client-user-disconnect",socket.email);
    RT.user_disconnect(socket.email);
  });

});

const PORT = process.env.PORT || 5000;
http.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
