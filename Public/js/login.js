const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const frmLogin = document.getElementById("frm-login");
const showPassword = document.getElementById("show-password");
let show = false
showPassword.addEventListener("click",() => {
  const txtPassword = document.getElementById("txt-password");
  if(show){
    txtPassword.setAttribute("type","password");
    showPassword.classList.remove("fa-eye");
    showPassword.classList.add("fa-eye-slash");
  }else{
    txtPassword.setAttribute("type","text");
    showPassword.classList.add("fa-eye");
    showPassword.classList.remove("fa-eye-slash");
  }
  show = !show;
});


btnRegister.addEventListener("click", (e) => {
  location.assign("/signup");
});

frmLogin.validate({
  rules: {
    "txt-email": {
      required: true,
    },
    "txt-password": {
      required: true,
    },
  },
  onSubmit: {
    action: function () {
      const emailVal = document.getElementById("txt-email").value;
      const passwordVal = document.getElementById("txt-password").value;
      const objToSend = { email: emailVal, password: passwordVal };
      login(objToSend);
    },
  },
});

function login(data) {
  const url = "/login";
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  // fetch method :
  fetch(url, options)
    .then((res) => {
      return res.text();
    })
    .then((obj) => {
      const jsonobj = JSON.parse(obj);
      if (jsonobj.done) {
        location.assign("/");
      } else {
        if (jsonobj.notfound) {
          document.getElementById("msg-ep-incorrect").innerHTML =
            '<i class="fas fa-exclamation-circle"></i>  ' + jsonobj.msg;
        } else {
          alert(jsonobj.msg);
        }
      }
    })
    .catch((err) => alert(err));
}
