document.getElementById("ch-photo").onchange = function (e) {
  let image = document.getElementById("img-ch-user-ph");
  let tmppath = URL.createObjectURL(event.target.files[0]);
  image.src = tmppath;
};

const frmRegister = document.getElementById("frm-register");
frmRegister.validate({
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
    "txt-email": {
      required: true,
      type: "email",
    },
    "txt-password": {
      required: true,
      minlength: 6,
      maxlength: 25,
    },
    "txt-confrim-password": {
      required: true,
      compare: "txt-password",
    },
  },
  onSubmit: {
    action: function () {
      const formData = new FormData();
      const photo = document.getElementById("ch-photo").files[0];
      formData.append(
        "firstName",
        document.getElementById("txt-first-name").value
      );
      formData.append(
        "lastName",
        document.getElementById("txt-last-name").value
      );
      formData.append("phone", document.getElementById("txt-phone").value);
      formData.append("country", document.getElementById("txt-country").value);
      formData.append("city", document.getElementById("txt-city").value);
      formData.append("email", document.getElementById("txt-email").value);
      formData.append(
        "password",
        document.getElementById("txt-password").value
      );
      formData.append("photo", photo);
      const objToSend = {
        firstName: document.getElementById("txt-first-name").value,
        lastName: document.getElementById("txt-last-name").value,
        phone: document.getElementById("txt-phone").value,
        country: document.getElementById("txt-country").value,
        city: document.getElementById("txt-city").value,
        email: document.getElementById("txt-email").value,
        password: document.getElementById("txt-password").value,
      };

      const searchParams = new URLSearchParams();
      for (const pair of formData) {
        if (pair[0] != "photo") searchParams.append(pair[0], pair[1]);
      }
      signup(formData);
    },
  },
});

const signup = (data) => {
  const url = "/signup";
  const options = {
    method: "POST",
    body: data,
  };
  // fetch method :
  fetch(url, options)
    .then((res) => {
      return res.text();
    })
    .then((text) => {
      const msg = JSON.parse(text).msg;
      if (msg == "done") {
        location.assign("/");
      }
      else{
        alert(msg);
      }
    })
    .catch((err) => alert(err));
};
