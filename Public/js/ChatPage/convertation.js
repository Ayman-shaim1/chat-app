const convertation = document.querySelector(".convertation");
function removeActive() {
  document.querySelectorAll(".chat-people").forEach((chatPeople) => {
    chatPeople.classList.remove("active");
  });
}
function onClickOpenConvertation() {
  document.querySelectorAll(".chat-people").forEach((chatPeople) => {
    chatPeople.addEventListener("click", () => {
      removeActive();
      chatPeople.classList.add("active");
      // get messages from the server :
      const email = chatPeople.getAttribute("id");
      const url = `/getConvertationMessages/${connectedUser.email}/${email}`;
      let html_messages = "";
      fetch(url)
        .then((res) => res.json())
        .then((obj) => {
          if (!obj.done) alert(obj.msg);
          else {
            const user = obj.user;
            const messages = obj.messages;
            messages.forEach((message) => {
              const isConnectedUser =
                message.messageFrom == connectedUser.email;
              const msg_class = isConnectedUser
                ? "my-message"
                : "friend-message";
              const html_message = `
                    <div class="${msg_class}" id="${message.messageDate}">
                        <div class="message-content">
                        <p class="message-text">
                           <span>${message.messageContent}</span>
                          <i class="fas fa-times"></i>
                        </p>
                        <div class="message-info">
                            <span class="message-date">${getMessageDate(
                              message.messageDate
                            )}</span>
                            ${
                              message.seen && isConnectedUser
                                ? '<span class="message-seen">seen</span>'
                                : ""
                            }
                        </div>
                        </div>
                    </div>`;
              html_messages += html_message;
            });
            openConvertation(user, html_messages);
          }
        })
        .catch((err) => alert(err));
    });
  });
}
function openConvertation(user, html_messages) {
  fetch(`/seenAllMessages/${connectedUser.email}/${user.email}`, {
    method: "PUT",
  })
    .then((res) => res.json())
    .then((obj) => {
      if (!obj.done) {
        alert(obj.msg);
      } else {
        // show the convertation template :
        const messaging = document.querySelector(
          ".messaging .chat-people-content"
        );
        const chp_a_id = `[id="${user.email}"]`;
        const chtp = messaging.querySelector(chp_a_id);
        if (chtp) {
          const lastMsg = chtp.querySelector(".chat-ib .last-msg");
          const nbrMsg = chtp.querySelector(".msg-time .nbr-msg");
          if (lastMsg) {
            lastMsg.classList.remove("notseen");
          }
          if (nbrMsg) {
            nbrMsg.remove();
          }
        }
        convertation.innerHTML = "";
        let html_convertationHeader = "";
        let html_convertationBody = "";
        let html_convertationFooter = "";
        html_convertationHeader = `
   <div class="conv-header">
   <div class="image-box">
       <img src="${user.photo}" class="avatar" />
       ${user.isOnLine ? '<span class="enline"></span>' : ""}
   </div>
   <div class="user-ib">
       <span class="user-name">${user.firstName + " " + user.lastName}</span>
       <span class="en-ligne">${getLastConnectionTime(
         user.lastConnection
       )}</span>
   </div>
   </div>`;
        html_convertationBody = `
  <div class="conv-body">
    ${html_messages ? html_messages : ""}
  </div>`;
        html_convertationFooter = `
   <div class="conv-footer">
   <div class="send-to-user">
       <input type="text" class="txt" placeholder="write something ..." id="txt-send-msg" />
       <button class="btn-send m-btn m-btn-blue m-btn-sm" id="btn-send-msg">
       <i class="fas fa-paper-plane"></i>
       </button>
   </div>
   </div>`;
        html_convertation =
          html_convertationHeader +
          html_convertationBody +
          html_convertationFooter;
        convertation.setAttribute("id", user.email);
        convertation.innerHTML = html_convertation;
        const convBody = convertation.querySelector(".conv-body");
        convBody.scrollBy(0, convBody.scrollHeight);
        tp_sendMessage();
        sp_USER_TYPING();
        seenMessage(connectedUser.email, user.email);
        convertation_deleteMessage();
        onClickOpenProfile();
      }
    })
    .catch((err) => alert(err));
}
function convertation_receiveMessage(message) {
  const convBody = convertation.querySelector(".conv-body");
  if (convBody) {
    const other_user_email = convertation.getAttribute("id");
    const messageTo = message.messageTo;
    const messageFrom = message.messageFrom;
    if (messageTo == connectedUser.email && messageFrom == other_user_email) {
      const html_message = `
        <div class="friend-message" id="${new Date(message.messageDate)}">
            <div class="message-content">
            <p class="message-text">
                <span>${message.messageContent}</span>
                <i class="fas fa-times"></i>
            </p>
            <div class="message-info">
                <span class="message-date">${getMessageDate(
                  message.messageDate
                )}</span>
                ${
                  message.seen && isConnectedUser
                    ? '<span class="message-seen">seen</span>'
                    : ""
                }
            </div>
            </div>
        </div>`;
      convBody.innerHTML += html_message;
      convBody.scrollBy(0, convBody.scrollHeight);
      fetch(`/seenAllMessages/${connectedUser.email}/${messageFrom}`, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((obj) => {
          if (!obj.done) {
            alert(obj.msg);
          } else {
            seenMessage(connectedUser.email, messageFrom);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  }
}
function tp_sendMessage() {
  const txtSendMsg = document.getElementById("txt-send-msg");
  const btnSendMsg = document.getElementById("btn-send-msg");
  const messageTo = convertation.getAttribute("id");
  const message = {};
  btnSendMsg.addEventListener("click", function () {
    const messageContent = txtSendMsg.value;
    if (messageContent != "") {
      message.messageTo = messageTo;
      message.messageFrom = connectedUser.email;
      message.messageContent = messageContent;
      message.messageDate = new Date();
      txtSendMsg.value = "";
      txtSendMsg.focus();
      const chp_id = `[id="${messageTo}"]`;
      const chat_people = document.querySelector(
        `.messaging .chat-people-content .chat-people${chp_id}`
      );
      if (chat_people) {
        const msgContent = chat_people.querySelector(".chat-ib .last-msg");
        const msgTime = chat_people.querySelector(".msg-time .time");
        const nbrMsg = chat_people.querySelector(".msg-time .nbr-msg");
        if (msgContent) {
          msgContent.innerText = "you : " + cut_message(messageContent);
          msgContent.classList.remove("notseen");
        }
        if (msgTime) {
          msgTime.innerText = getMessageTime(message.messageDate);
        }
        if (nbrMsg) nbrMsg.remove();
        chat_people.remove();
        document
          .querySelector(`.messaging .chat-people-content`)
          .prepend(chat_people);

        sendMessage(message);
      }
      const convBody = convertation.querySelector(".conv-body");
      if (convBody) {
        html_message = `
          <div class="my-message" id="${message.messageDate}">
            <div class="message-content">
            <p class="message-text">
                <span>${messageContent}</span>
                <i class="fas fa-times"></i>
                </p>
            <div class="message-info">
                <span class="message-date">${getMessageDate(
                  message.messageDate
                )}</span>        
            </div>
            </div>
        </div>`;
        convBody.innerHTML += html_message;
        convBody.scrollBy(0, convBody.scrollHeight);
      }
    }
  });
}
function sp_USER_TYPING() {
  const senderUser = connectedUser.email;
  const receivedUser = convertation.getAttribute("id");
  const txtSendMessage = document.getElementById("txt-send-msg");
  txtSendMessage.addEventListener("keypress", () => {
    UserTyping({ senderUser, receivedUser });
  });
  txtSendMessage.addEventListener("keyup", () => {
    UserStopTyping({ senderUser, receivedUser });
  });
}
function convertation_user_typing({ senderUser, receivedUser }) {
  const openConnvEmail = convertation.getAttribute("id");
  if (
    openConnvEmail &&
    openConnvEmail == senderUser &&
    receivedUser == connectedUser.email
  ) {
    const user_ib = convertation.querySelector(".conv-header .user-ib");
    const online = user_ib.querySelector(".en-ligne");
    online.style.display = "none";
    const typing = user_ib.querySelector(".typing");
    if (!typing) {
      user_ib.innerHTML += "<span class='typing'>typing...</span>";
    }
  }
}
function convertation_user_stop_typing({ senderUser, receivedUser }) {
  const openConnvEmail = convertation.getAttribute("id");
  if (
    openConnvEmail &&
    openConnvEmail == senderUser &&
    receivedUser == connectedUser.email
  ) {
    const user_ib = convertation.querySelector(".conv-header .user-ib");
    const online = user_ib.querySelector(".en-ligne");
    const typing = user_ib.querySelector(".typing");
    if (typing) {
      setTimeout(() => {
        online.style.display = "block";
        typing.remove();
      }, 2000);
    }
  }
}
function convertation_seenMessage(connectedUser_email, otherUser) {
  const email = convertation.getAttribute("id");
  if (
    email &&
    email == connectedUser_email &&
    otherUser == connectedUser.email
  ) {
    const convBody = convertation.querySelector(".conv-body");
    convBody.querySelectorAll(".my-message").forEach((message) => {
      const msgInfo = message.querySelector(".message-info");
      const seen = msgInfo.querySelector(".message-seen");
      if (seen) {
        seen.innerHTML = "seen";
      } else {
        msgInfo.innerHTML += '<span class="message-seen">seen</span>';
      }
    });
  }
}
function convertation_deleteMessage() {
  convertation
    .querySelectorAll(".my-message .message-content .message-text i")
    .forEach((message) => {
      message.addEventListener("click", () => {
        const id = message.parentElement.parentElement.parentElement.getAttribute(
          "id"
        );
        const messageToRemove =
          message.parentElement.parentElement.parentElement;
        const objToSend = {
          connectedUser_email: connectedUser.email,
          otherUser_email: convertation.getAttribute("id"),
          targetedMessageDate: id,
          isTheSender: true,
        };
        const previousMessage = messageToRemove.previousElementSibling;
        const email = convertation.getAttribute("id");
        messaging_deleteMessage(messageToRemove, previousMessage, email);
        messageToRemove.remove();

        deleteConvertation(messageToRemove, objToSend);
      });
    });
  convertation
    .querySelectorAll(".friend-message .message-content .message-text i")
    .forEach((message) => {
      message.addEventListener("click", () => {
        const id = message.parentElement.parentElement.parentElement.getAttribute(
          "id"
        );
        const messageToRemove =
          message.parentElement.parentElement.parentElement;
        const objToSend = {
          connectedUser_email: connectedUser.email,
          otherUser_email: convertation.getAttribute("id"),
          targetedMessageDate: id,
          isTheSender: false,
        };
        const previousMessage = messageToRemove.previousElementSibling;
        const email = convertation.getAttribute("id");
        messaging_deleteMessage(messageToRemove, previousMessage, email);
        messageToRemove.remove();

        deleteConvertation(messageToRemove, objToSend);
      });
    });
}
function deleteConvertation(messageToRemove, data) {
  fetch("/deleteMessage", {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((obj) => {
      if (!obj.done) {
        alert(obj.msg);
      } else {
        if (messageToRemove) messageToRemove.remove();
      }
    })
    .catch((err) => {
      alert(err);
    });
}

function convertation_userConnect(email) {
  const convemail = convertation.getAttribute("id");
  if (convemail && convemail == email) {
    const userPhotoBox = convertation.querySelector(".conv-header .image-box");
    const online = userPhotoBox.querySelector(".enline");
    if (!online) {
      userPhotoBox.innerHTML += "<span class='enline'></span>";
    }
    const userIBOnLine = convertation.querySelector(
      ".conv-header .user-ib .en-ligne"
    );
    userIBOnLine.innerText = "online";
  }
}
function convertation_userDisconnect(email) {
  const convemail = convertation.getAttribute("id");
  if (convemail && convemail == email) {
    const userPhotoBox = convertation.querySelector(".conv-header .image-box");
    const online = userPhotoBox.querySelector(".enline");
    if (online) {
      online.remove();
    }
    const userIBOnLine = convertation.querySelector(
      ".conv-header .user-ib .en-ligne"
    );
    userIBOnLine.innerText = "online 1 minute ago";
  }
}
function onClickOpenProfile() {
  const avatar = convertation.querySelector(".conv-header .image-box img");
  const email = convertation.getAttribute("id");
  avatar.addEventListener("click", () => {
    fetch(`/getUser/${email}`)
      .then((res) => res.json())
      .then((obj) => {
        if (!obj.done) {
          alert(obj.msg);
        } else {
          openProfile(obj.user);
        }
      });
  });
}
