const socket = io("http://localhost:5000");
socket.emit("userConnect", connectedUser.email);

socket.on("client-user-connect", (email) => {
  messaging_userConnect(email);
  convertation_userConnect(email);
});

socket.on("client-user-disconnect", (email) => {
  messaging_userDiconnect(email);
  convertation_userDisconnect(email);
});

function sendMessage(message) {
  socket.emit("send-message", message);
}
socket.on("receive-message", (message) => {
  messaging_receiveMessage(message);
  convertation_receiveMessage(message);
});
function UserTyping({ senderUser, receivedUser }) {
  socket.emit("userTyping", { senderUser, receivedUser });
}
function UserStopTyping({ senderUser, receivedUser }) {
  socket.emit("userStopTyping", { senderUser, receivedUser });
}
function seenMessage(connectedUser_email, otherUser) {
  socket.emit("seenMessage", { connectedUser_email, otherUser });
}

socket.on("client-seen-message", ({ connectedUser_email, otherUser }) => {
  convertation_seenMessage(connectedUser_email, otherUser);
});

socket.on("client-user-typing", ({ senderUser, receivedUser }) => {
  messaging_user_typing({ senderUser, receivedUser });
  convertation_user_typing({ senderUser, receivedUser });
});
socket.on("client-user-stop-typing", ({ senderUser, receivedUser }) => {
  messaging_user_stop_typing({ senderUser, receivedUser });
  convertation_user_stop_typing({ senderUser, receivedUser });
});
