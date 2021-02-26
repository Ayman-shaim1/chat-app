const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { userModel } = require("../Models/User");

// create token :
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.secretkey, {
    expiresIn: maxAge,
  });
};

// Set storage engine :
const storage = multer.diskStorage({
  destination: "./Public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Init upload :
const upload = multer({
  storage,
  limits: { filesize: 100000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("photo");

// Cheack file type :
const checkFileType = (file, cb) => {
  const ext = path.extname(file.originalname).toLocaleLowerCase();
  if (ext == ".jpeg" || ext == ".png" || ext == ".jpg") {
    return cb(null, true);
  } else {
    cb("Images Only !!");
  }
};

module.exports.signup_get = (req, res) => {
  res.render("signupPage", { title: "signup" });
};
module.exports.login_get = (req, res) => {
  res.render("loginPage", { title: "login" });
};
module.exports.signup_post = (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log("[PHOTO ERROR] =>" + err);
        res.status(400).json({ msg: "something wrong with the image !" });
      } else {
        let photo = "./images/user.png";
        if (req.file != undefined) {
          photo = "./uploads/" + req.file.filename;
        }
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
          const userToAdd = await userModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            country: req.body.country,
            city: req.body.city,
            email: req.body.email,
            password: req.body.password,
            photo: photo,
          });
          const token = createToken(userToAdd._id);
          res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
          // Send response :
          res.status(201).json({
            msg: "done",
            data: userToAdd,
          });
        } else {
          res.status(400).json({ msg: " this user is already existe !" });
        }
      }
    });
  } catch (exerror) {
    console.log("[EXCEPTION] => " + exerror._message);
    res.status(400).json({ msg: exerror._message });
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const users = await userModel.find();
    const user = users.find((x) => x.email == req.body.email);

    if (user) {
      const existePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (existePassword) {
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
          done: true,
          msg: "done",
        });
      } else {
        res.json({
          notfound: true,
          done: false,
          msg: "Passwrod incorrect !",
        });
      }
    } else {
      res.json({
        notfound: true,
        done: false,
        msg: "Email incorrect !",
      });
    }
  } catch (exerr) {
    res.json({
      done: false,
      msg: exerr._message,
    });
    console.log("[EXCEPTION] => " + exerr._message);
  }
};

module.exports.logout_post = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};
module.exports.render_update_page = async (req, res) => {
  res.render("updatePage", { title: "update" });
};
module.exports.change_photo_post = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log("[PHOTO ERROR] =>" + err.message);
        res.json({ done: false, msg: err.message });
      } else {
        const userphoto = req.body.userphoto;
        const email = req.body.email;
        let photo = "./images/user.png";
        if (req.file != undefined) {
          photo = "./uploads/" + req.file.filename;
        }
        const user = await userModel.updateOne(
          { email },
          {
            $set: {
              photo: photo,
            },
          }
        );

        if (userphoto != "./images/user.png") {
          const user_photo_file_name = userphoto.split("uploads")[1];
          const filepath =
            "C:/Users/NANOTECH/Documents/Node.js Projects/Chat-App/Public/uploads" +
            user_photo_file_name;
          fs.unlink(filepath, async (err) => {
            if (err) {
              res.json({
                done: false,
                msg: err.message,
                notfound: false,
              });
            } else {
              res.json({
                done: true,
                msg: "your photo has been changed !",
                photo: photo,
              });
            }
          });
        } else {
          res.json({
            done: true,
            msg: "your photo has been changed !",
            photo: photo,
          });
        }
      }
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};

module.exports.change_user_info_post = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, country, city } = req.body;
    const user = await userModel.updateOne(
      { email },
      {
        firstName,
        lastName,
        phone,
        country,
        city,
      }
    );
    res.json({
      done: true,
      msg: "your informations has ben changed !",
      user: req.body,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
module.exports.change_password_post = async (req, res) => {
  try {
    const { current_password, new_password, email } = req.body;
    const users = await userModel.find();
    const user = users.find((x) => x.email == email);

    if (user) {
      const existePassword = await bcrypt.compare(
        current_password,
        user.password
      );
      if (existePassword) {
        const salt = await bcrypt.genSalt(10);
        const crppassword = await bcrypt.hash(new_password, salt);
        await userModel.updateOne(
          { email },
          {
            $set: {
              password: crppassword,
            },
          }
        );
        res.json({
          done: true,
          msg: "your password  has been changed !",
        });
      } else {
        res.json({
          done: false,
          msg: "the current password is incorrect !",
        });
      }
    } else {
      res.json({
        done: false,
        msg: "the email is incorrect !",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};

