const messaging = document.querySelector(".messaging .chat-people-content");
const btnAddNewConvertation = document.querySelector(".messaging .add button");

function cut_message(message) {
  if (message.length > 40) {
    return message.slice(0, 40) + "...";
  } else {
    return message;
  }
}
// get convertation with other users :
fetch(`/getLastMessages/${connectedUser.email}`)
  .then((res) => res.json())
  .then((obj) => {
    if (obj.done) {
      const data = obj.data;
      data.forEach((item) => {
        const user = item.user;
        const lastMessage = item.messages[0];
        const isConnectedUser = lastMessage.messageFrom == connectedUser.email;
        const notseenMessages = item.messages.filter(
          (x) => !x.seen && x.messageFrom != connectedUser.email
        );
        const html_chat_people = `
        <div class="chat-people" id=${user.email}>
        <div class="image-box">
            <img src="${user.photo}" alt="" class="avatar avatar-sm" />
            ${user.isOnLine ? '<span class="enline"></span>' : ""}
        </div>
        <div class="chat-ib">
            <span class="user-name">
                ${user.firstName + " " + user.lastName}
            </span> 
            <span class="last-msg ${
              !lastMessage.seen && !isConnectedUser ? "notseen" : ""
            }">
                ${
                  isConnectedUser
                    ? "you : " + cut_message(lastMessage.messageContent)
                    : cut_message(lastMessage.messageContent)
                }
            </span>
        </div>
        <div class="msg-time">
            <span class="time">${getMessageTime(lastMessage.messageDate)}</span>
            ${
              notseenMessages.length != 0 &&
              lastMessage.messageFrom != connectedUser.email
                ? '<span class="nbr-msg">' + notseenMessages.length + "</span>"
                : ""
            } 
        </div>
        <div class="remove-convertaion-box">
            <i class="fas fa-times"></i>  
        </div>
    </div>`;
        messaging.innerHTML += html_chat_people;
      });
      onClickOpenConvertation();
      deleteConvertation();
      onClickShowUserProfile();
    } else {
      alert(obj.msg);
    }
  })
  .catch((err) => alert(err));

function messaging_receiveMessage(message) {
  if (message.messageTo == connectedUser.email) {
    const convertation = document.querySelector(".convertation");
    const email = convertation.getAttribute("id");
    const messageFrom = message.messageFrom;
    const qs_id_a = `[id="${messageFrom}"]`;
    const targeted_chp = messaging.querySelector(qs_id_a);
    if (targeted_chp) {
      const msg = targeted_chp.querySelector(".chat-ib .last-msg");
      const msgTime = targeted_chp.querySelector(".msg-time .time");
      const nbrmsg = targeted_chp.querySelector(".msg-time .nbr-msg");
      msg.innerHTML = cut_message(message.messageContent);
      if (msgTime) {
        msgTime.innerText = getMessageTime(message.messageDate);
      }
      if (email == messageFrom) {
        msg.classList.remove("notseen");
      } else {
        msg.classList.add("notseen");
      }

      if (nbrmsg && email != messageFrom) {
        const nbr = parseInt(nbrmsg.innerText) + 1;
        nbrmsg.innerText = nbr;
      } else {
        if (email != messageFrom) {
          const html_nbr = '<span class="nbr-msg">1</span>';
          targeted_chp.querySelector(".msg-time").innerHTML += html_nbr;
        }
      }
      targeted_chp.remove();
      messaging.prepend(targeted_chp);
    } else {
      fetch(`/getUser_newConvertaion/${messageFrom}`)
        .then((res) => res.json())
        .then((obj) => {
          if (!obj.done) {
            alert(obj.msg);
          } else if (obj.done && !obj.notfound) {
            const senderUser = obj.senderUser;
            const html_chat_people = `
                <div class="chat-people" id="${messageFrom}">
                  <div class="image-box">
                      <img src="${
                        senderUser.photo
                      }" alt="" class="avatar avatar-sm">
                  </div>
                  <div class="chat-ib">
                      <span class="user-name">
                          ${senderUser.firstName + " " + senderUser.lastName}
                      </span>
                      <span class="last-msg notseen">${cut_message(
                        message.messageContent
                      )}</span>
                  </div>
                  <div class="msg-time">
                      <span class="time">${getMessageTime(
                        message.messageDate
                      )}</span>
                      <span class="nbr-msg">1</span>
                  </div>
                  <div class="remove-convertaion-box">
                    <i class="fas fa-times"></i>  
                </div>
              </div> `;
            messaging.insertAdjacentHTML("afterbegin", html_chat_people);
            onClickOpenConvertation();
            onClickShowUserProfile();
          }
        })
        .catch((err) => alert(err));
    }
  }
}
function messaging_user_typing({ senderUser, receivedUser }) {
  if (receivedUser == connectedUser.email) {
    const chp_id = `[id="${senderUser}"]`;
    const chat_people = messaging.querySelector(chp_id);
    if (chat_people) {
      const html_chat_ib = chat_people.querySelector(".chat-ib");
      const html_messageContent_elt = html_chat_ib.querySelector(".last-msg");
      html_messageContent_elt.style.display = "none";
      const typing = html_chat_ib.querySelector(".typing");
      if (!typing) {
        isTyping = true;
        html_chat_ib.innerHTML += "<span class='typing'>typing ..</span>";
      }
    }
  }
}
function messaging_user_stop_typing({ senderUser, receivedUser }) {
  if (receivedUser == connectedUser.email) {
    const chp_id = `[id="${senderUser}"]`;
    const chat_people = messaging.querySelector(chp_id);
    if (chat_people) {
      const html_chat_ib = chat_people.querySelector(".chat-ib");
      const html_messageContent_elt = html_chat_ib.querySelector(".last-msg");
      const typing = html_chat_ib.querySelector(".typing");
      if (typing) {
        setTimeout(() => {
          html_messageContent_elt.style.display = "block";
          typing.remove();
        }, 2000);
      }
    }
  }
}
// add new convertaion :
let modal = null,
  isOpen = false;
btnAddNewConvertation.addEventListener("click", () => {
  const ex_modal = document.querySelector(".modal");
  if (ex_modal) ex_modal.remove();

  const html = `
    <div class="add-new-convertation-box">
      <div class="search-box">
        <input class="m-txt" placeholder="search ..." id="txt-search-users"/>
        <button class="m-btn m-btn-blue" id="btn-get-users">
          <i class="fa fa-search"></i>
         </button>
      </div>
      <div class="search-result">
        <h2>search for other users </h2>
      </div>
    </div>`;

  modal = new Modal({
    title: "Add new convertaion",
    content: html,
  });

  modal.open();
  isOpen = true;
  if (isOpen) onClickGetUsers();
});

function onClickGetUsers() {
  const addNew = document.querySelector(
    ".add-new-convertation-box .search-result"
  );
  const btnGetUser = document.getElementById("btn-get-users");
  const txtSearchUsers = document.getElementById("txt-search-users");
  btnGetUser.addEventListener("click", () => {
    if (txtSearchUsers.value != "") {
      fetch(`/getUsers/${txtSearchUsers.value}/${connectedUser.email}`)
        .then((res) => res.json())
        .then((obj) => {
          if (!obj.done) {
            alert(obj.msg);
          } else {
            if (obj.users.length != 0) {
              const h2 = addNew.querySelector("h2");
              if (h2) h2.remove();
              addNew.innerHTML = "";
              obj.users.forEach((user) => {
                const user_html = `
              <div class="user" id="${user.email}">
                    <div class="user-image-box">
                      <img src="${user.photo}" class="avatar avatar-sm"/>
                    </div>
                    <div class="user_ib">
                      <span class="fullName">${
                        user.firstName + " " + user.lastName
                      }</span>
                      <span class="city_country">${
                        user.city + " | " + user.country
                      }</span>
                    </div>
                    <div class="btn-add-box">
                      <button class="m-btn m-btn-blue m-btn-sm">
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>`;
                addNew.innerHTML += user_html;
              });
              removeActive();
              onClickOpenNewConvertation();
            } else {
              addNew.innerHTML = "<h2>Nothing found !</h2>";
            }
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  });
}
function onClickOpenNewConvertation() {
  document.querySelectorAll(".btn-add-box button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.parentElement.parentElement.getAttribute("id");
      fetch(`/getUser/${email}`)
        .then((res) => res.json())
        .then((obj) => {
          if (!obj.done) {
            alert(obj.msg);
          } else {
            modal.close();
            const chp_id = `[id="${obj.user.email}"]`;
            const chp_existe = messaging.querySelector(chp_id);
            if (!chp_existe) {
              const html_chat_people = `
                <div class="chat-people active" id="${obj.user.email}">
                  <div class="image-box">
                      <img src="${
                        obj.user.photo
                      }" alt="" class="avatar avatar-sm">
                  </div>
                  <div class="chat-ib">
                      <span class="user-name">
                          ${obj.user.firstName + " " + obj.user.lastName}
                      </span>
                      <span class="last-msg"></span>
                  </div>
                  <div class="msg-time">
                   
                  </div>
                  <div class="remove-convertaion-box">
                    <i class="fas fa-times"></i>  
                  </div>
              </div> `;
              messaging.insertAdjacentHTML("afterbegin", html_chat_people);
              openConvertation(obj.user);
              onClickOpenConvertation();
              onClickShowUserProfile();
            }
          }
        })
        .catch((err) => alert(err));
    });
  });
}
function deleteConvertation() {
  messaging
    .querySelectorAll(".chat-people .remove-convertaion-box i")
    .forEach((btnRemove) => {
      btnRemove.addEventListener("click", () => {
        const email = btnRemove.parentElement.parentElement.getAttribute("id");
        const deleteConv_modal = new Modal({
          title: "Confirmation",
          content: "<h3>do you want delete this convertation ?</h3>",
          buttons: [
            {
              text: "yes",
              class: "m-btn m-btn-blue m-btn-sm",
              onClick: function () {
                fetch(`/deleteConvertation/${connectedUser.email}/${email}`, {
                  method: "DELETE",
                })
                  .then((res) => res.json())
                  .then((obj) => {
                    if (!obj.done) {
                      alert(obj.msg);
                    } else {
                      btnRemove.parentElement.parentElement.remove();
                      deleteConv_modal.close();
                    }
                  })
                  .catch((err) => {
                    alert(err);
                  });
              },
            },
            {
              text: "no",
              onClick: function () {
                deleteConv_modal.close();
              },
            },
          ],
        });
        deleteConv_modal.open();
      });
    });
}
deleteConvertation();
function messaging_deleteMessage(deletedMessage, previousMessage, user_email) {
  const deleteMessageNextElement = deletedMessage.nextElementSibling;
  if (!deleteMessageNextElement) {
    const chpAId = `[id="${user_email}"]`;
    const chp = messaging.querySelector(chpAId);
    if (chp) {
      if (previousMessage) {
        const prvClass = previousMessage.className;
        const previousMSGCT = previousMessage.querySelector(
          ".message-content .message-text span"
        ).innerText;
        if (prvClass == "my-message") {
          chp.querySelector(".chat-ib .last-msg").innerText =
            "you : " + previousMSGCT;
        } else {
          chp.querySelector(".chat-ib .last-msg").innerText = previousMSGCT;
        }
      } else {
        chp.querySelector(".chat-ib .last-msg").innerText = "";
      }
    }
  }
}
function messaging_userConnect(email) {
  const chpAId = `[id="${email}"]`;
  const chp = messaging.querySelector(chpAId);
  if (chp) {
    const online = messaging.querySelector(".image-box .enline");
    if (!online) {
      messaging.querySelector(".image-box").innerHTML +=
        '<span class="enline"></span>';
    }
  }
}
function messaging_userDiconnect(email) {
  const chpAId = `[id="${email}"]`;
  const chp = messaging.querySelector(chpAId);
  if (chp) {
    const online = messaging.querySelector(".image-box .enline");
    if (online) {
      online.remove();
    }
  }
}
function onClickShowUserProfile() {
  messaging.querySelectorAll(".chat-people").forEach((chatpeople) => {
    chatpeople.querySelector(".image-box img").addEventListener("click", () => {
      const email = chatpeople.getAttribute("id");
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
  });
}
document.getElementById("txt-search-chp").addEventListener("keyup", (e) => {
  messaging.querySelectorAll(".chat-people").forEach((chp) => {
    const fullName = chp.querySelector(".chat-ib .user-name").innerText;
    const email = chp.getAttribute("id");
    const value = e.target.value;
    if (
      !fullName.toLowerCase().includes(value) &&
      !email.toLowerCase().includes(value)
    ) {
      chp.style.display = "none";
    } else {
      chp.style.display = "flex";
    }
  });
});
