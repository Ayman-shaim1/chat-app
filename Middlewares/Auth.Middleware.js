const jwt = require("jsonwebtoken");
const { userModel } = require("../Models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exsits & is verified :
  if (token) {
    jwt.verify(token, process.env.secretkey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};
const requireAuth_req_irr = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exsits & is verified :
  if (token) {
    jwt.verify(token, process.env.secretkey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.json({
          done: false,
          msg: err.message,
        });
      } else {
        next();
      }
    });
  } else {
    res.json({
      done: false,
      msg: "token undefined !",
    });
  }
};
const requireNotAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.secretkey, (err, decodedToken) => {
      if (err) {
        next();
      } else {
        res.redirect("/");
      }
    });
  } else {
    next();
  }
};
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.secretkey, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await userModel.findById(decodedToken.id);
        if(user){
        user._id = null;
        user.password = null;
        user.receivedMessages = null;
        user.sentMessages = null;
        res.locals.user = JSON.stringify(user);
        }else
        res.locals.user = null;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = {
  requireAuth,
  requireNotAuth,
  checkUser,
  requireAuth_req_irr,
};
