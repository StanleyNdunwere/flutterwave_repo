const jwt = require("jsonwebtoken");
const { isUsernameDuplicate } = require("../models/users/userService")

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    res.header({ status: 401 }).send({
      status: "failed",
      message: "Session expired, please sign in again",
    });
  } else {
    jwt.verify(token, process.env.jwtSecret, (err, user) => {
      if (err) {
        res.header({ status: 403 }).send({
          status: "failed",
          message: "Session expired, please retry or sign in again",
        });
      } else {
        req.user = user;
        next();
      }
    })
  }
}

const duplicateId = async (req, res, next) => {
  const duplicate = await isUsernameDuplicate(req.body.username);

  if (duplicate) {
    res.header({ status: 400 }).send({
      status: "failed",
      data: { message: "User id is already taken. Choose another please" }
    });
  } else {
    next();
  }
}

module.exports = {
  auth: authenticate,
  duplicateId,
}