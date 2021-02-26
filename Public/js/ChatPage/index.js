const profileBox = document.querySelector(".profile-box");
const btn_logout = profileBox.querySelector("#btn-logout");
const btnUpdate = document.getElementById("btn-update");

window.onload = async () => {
  document.getElementById("user-header-image").src = connectedUser.photo;
};

btnUpdate.addEventListener("click", () => {
  location.assign("/update");
});

function getMessageTime(msgdate) {
  const todayDate = new Date();
  const messageDate = new Date(msgdate);
  if (
    todayDate.getDay() - messageDate.getDay() == 0 &&
    todayDate.getMonth() == messageDate.getMonth() &&
    todayDate.getFullYear() == messageDate.getFullYear()
  ) {
    return messageDate.getHours() + ":" + messageDate.getUTCMinutes();
  } else if (
    todayDate.getDay() - messageDate.getDay() == 1 &&
    todayDate.getMonth() == messageDate.getMonth() &&
    todayDate.getFullYear() == messageDate.getFullYear()
  ) {
    return "yesterday";
  } else if (
    todayDate.getDay() - messageDate.getDay() > 1 &&
    todayDate.getMonth() == messageDate.getMonth() &&
    todayDate.getFullYear() == messageDate.getFullYear()
  ) {
    return (
      messageDate.getDay() +
      "/" +
      (messageDate.getMonth() + 1) +
      "/" +
      messageDate.getFullYear()
    );
  } else {
    return (
      messageDate.getDay() +
      "/" +
      (messageDate.getMonth() + 1) +
      "/" +
      messageDate.getFullYear()
    );
  }
}

function getLastConnectionTime(userLastConnection) {
  if (!userLastConnection) {
    return "online";
  }
  const todayDate = new Date();
  const lastConnection = new Date(userLastConnection);
  if (
    todayDate.getDate() - lastConnection.getDate() == 0 &&
    todayDate.getMonth() == lastConnection.getMonth() &&
    todayDate.getFullYear() == lastConnection.getFullYear()
  ) {
    // on line today :
    if (todayDate.getHours() - lastConnection.getHours() == 0) {
      let s = "";
      if (todayDate.getMinutes() - lastConnection.getMinutes() == 0) {
        s = "online 1 minute ago";
      } else {
        s = `online ${
          todayDate.getMinutes() - lastConnection.getMinutes()
        } minutes ago`;
      }
      return s;
    } else {
      return `online ${
        todayDate.getHours() - lastConnection.getHours()
      } hours ago`;
    }
  } else if (
    todayDate.getDate() - lastConnection.getDate() == 1 &&
    todayDate.getMonth() == lastConnection.getMonth() &&
    todayDate.getFullYear() == lastConnection.getFullYear()
  ) {
    return "online yesterday";
  } else if (
    todayDate.getDate() - lastConnection.getDate() > 1 &&
    todayDate.getMonth() == lastConnection.getMonth() &&
    todayDate.getFullYear() == lastConnection.getFullYear()
  ) {
    return `last connection in ${
      lastConnection.getDate() +
      "/" +
      (lastConnection.getMonth() + 1) +
      "/" +
      lastConnection.getFullYear()
    }`;
  } else {
    return `last connection in ${
      lastConnection.getDate() +
      "/" +
      (lastConnection.getMonth() + 1) +
      "/" +
      lastConnection.getFullYear()
    }`;
  }
}
function openProfile(user, isConnectedUser) {
  const image = profileBox.querySelector("#user-image");
  const fullName = profileBox.querySelector("#full-name");
  const lastConnection = profileBox.querySelector("#online");
  const phone = profileBox.querySelector("#phone");
  const country = profileBox.querySelector("#country");
  const city = profileBox.querySelector("#city");
  image.src = user.photo;
  fullName.innerText = user.firstName + " " + user.lastName;
  phone.innerText = user.phone;
  country.innerText = user.country;
  city.innerText = user.city;
  if (isConnectedUser) {
    lastConnection.innerText = "";
    btn_logout.style.display = "block";
    btnUpdate.style.display = "block";
  } else {
    btn_logout.style.display = "none";
    btnUpdate.style.display = "none";
    if (!user.isOnLine) {
      // console.log(user.lastConnection);
      lastConnection.innerText = getLastConnectionTime(user.lastConnection);
    } else {
      lastConnection.innerText = "online";
    }
  }
  profileBox.classList.add("open");
}

if (profileBox != undefined) {
  profileBox.addEventListener("click", function () {
    document.querySelector(".profile-box").classList.remove("open");
  });
}

const userAvatar = document.querySelector("header .user-image-box .avatar");
if (userAvatar != undefined) {
  userAvatar.addEventListener("click", async function () {
    openProfile(connectedUser, true);
  });
}

function getMessageDate(messageDate) {
  const msgDate = new Date(messageDate);
  let mounth = "";
  if (msgDate.getMonth() + 1 == 1) mounth = "January";
  else if (msgDate.getMonth() + 1 == 2) mounth = "February";
  else if (msgDate.getMonth() + 1 == 3) mounth = "March";
  else if (msgDate.getMonth() + 1 == 4) mounth = "April";
  else if (msgDate.getMonth() + 1 == 5) mounth = "May";
  else if (msgDate.getMonth() + 1 == 6) mounth = "June";
  else if (msgDate.getMonth() + 1 == 7) mounth = "July";
  else if (msgDate.getMonth() + 1 == 8) mounth = "August";
  else if (msgDate.getMonth() + 1 == 9) mounth = "September";
  else if (msgDate.getMonth() + 1 == 10) mounth = "October";
  else if (msgDate.getMonth() + 1 == 11) mounth = "November";
  else if (msgDate.getMonth() + 1 == 12) mounth = "December";
  return (
    msgDate.getHours() +
    ":" +
    msgDate.getMinutes() +
    " | " +
    mounth +
    " " +
    msgDate.getDate() +
    " " +
    msgDate.getFullYear()
  );
}
