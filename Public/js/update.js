const frmInfo = document.getElementById("frm-update-user-info");
const frmPassword = document.getElementById("frm-update-password");
const image = document.getElementById("user-photo");
const btnDeleteUserPhoto = document.getElementById("delete-user-photo");
const chPhoto = document.getElementById("ch-photo");
const btnChangeUserPhoto = document.getElementById("change-user-photo");

let file = null;
chPhoto.onchange = function (e) {
  file = event.target.files[0];
  if (file) {
    const tmppath = URL.createObjectURL(file);
    image.src = tmppath;
  } else {
    image.src = connectedUser.photo;
  }
};
// remove photo :
btnDeleteUserPhoto.addEventListener("click", () => {
  if (file) {
    chPhoto.value = "";
  }
  image.src = "./images/user.png";
});

function rr_changephoto(){
  let modal = new Modal({
    title: "Confirmation",
    width: "450px",
    content: "do you want change your photo ?",
    buttons: [
      {
        text: "yes",
        class: "m-btn m-btn-sm m-btn-red",
        onClick: function () {
          const formData = new FormData();
          formData.append("photo", file);
          formData.append("email", connectedUser.email);
          formData.append("userphoto", connectedUser.photo);
          changeUserPhoto(formData);
          modal.close();
        },
      },
      {
        text: "non",
      },
    ],
  });
  modal.open();
}
// change user photo :
btnChangeUserPhoto.addEventListener("click", () => {
  if (
    connectedUser.photo == "./images/user.png" &&
    image.src != "http://localhost:5000/images/user.png"
  ) {
    rr_changephoto();
  }
  if (
    image.src.split("uploads")[1] != connectedUser.photo.split("uploads")[1]
  ) {
    rr_changephoto();
  }
});
function changeUserPhoto(data) {
  fetch("/changePhoto", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((obj) => {
      if (!obj.done) {
        alert(obj.msg);
      } else {
        image.src = obj.photo;
        chPhoto.value = null;
        connectedUser.photo = obj.photo;
        alert(obj.msg);
      }
    });
}

// frm change user info validation :
frmInfo.validate({
  rules: {
    "txt-first-name": {
      required: true,
    },
    "txt-last-name": {
      required: true,
    },
    "txt-phone": {
      required: true,
    },
    "txt-country": {
      required: true,
    },
    "txt-city": {
      required: true,
    },
  },
  onSubmit: {
    action: function () {
      const isChanged = frmInfo.querySelector(".change");
      if (isChanged) {
        let modal = new Modal({
          title: "Confirmation",
          width: "450px",
          content: "do you want change your info ?",
          buttons: [
            {
              text: "yes",
              class: "m-btn m-btn-sm m-btn-red",
              onClick: function () {
                const objToSend = {
                  email: connectedUser.email,
                  firstName: frmInfo.querySelector("#txt-first-name").value,
                  lastName: frmInfo.querySelector("#txt-last-name").value,
                  phone: frmInfo.querySelector("#txt-phone").value,
                  country: frmInfo.querySelector("#txt-country").value,
                  city: frmInfo.querySelector("#txt-city").value,
                };
                changeUserInfo(objToSend);
                modal.close();
              },
            },
            {
              text: "non",
            },
          ],
        });
        modal.open();
      }
    },
  },
});
function changeUserInfo(data) {
  fetch("/changeInfo", {
    method: "POST",
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
        frmInfo.querySelectorAll(".change").forEach((input) => {
          input.classList.remove("change");
          input.classList.add("unchange");
        });
        connectedUser.firstName = obj.user.firstName;
        connectedUser.lastName = obj.user.lastName;
        connectedUser.phone = obj.user.phone;
        connectedUser.country = obj.user.country;
        connectedUser.city = obj.user.city;
        alert(obj.msg);
      }
    });
}
// frm change password validation :
frmPassword.validate({
  rules: {
    "txt-email": {
      required: true,
      type: "email",
    },
    "txt-current-password": {
      required: true,
    },
    "txt-new-password": {
      required: true,
      minlength: 6,
    },
    "txt-confirm-new-password": {
      required: true,
      compare: "txt-password",
    },
  },
  onSubmit: {
    action: function () {
      let modal = new Modal({
        title: "Confirmation",
        width: "450px",
        content: "do you want change your password ?",
        buttons: [
          {
            text: "yes",
            class: "m-btn m-btn-sm m-btn-red",
            onClick: function () {
              const objToSend = {
                current_password: frmPassword.querySelector(
                  "#txt-current-password"
                ).value,
                new_password: frmPassword.querySelector("#txt-new-password")
                  .value,
                email: connectedUser.email,
              };
              changePassword(objToSend);
              modal.close();
            },
          },
          {
            text: "non",
          },
        ],
      });
      modal.open();
    },
  },
});
function changePassword(data) {
  fetch("/changePassword", {
    method: "POST",
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
        alert(obj.msg);
        frmPassword.querySelector("#txt-current-password").value = "";
        frmPassword.querySelector("#txt-new-password").value = "";
        frmPassword.querySelector("#txt-confirm-new-password").value = "";
      }
    });
}
