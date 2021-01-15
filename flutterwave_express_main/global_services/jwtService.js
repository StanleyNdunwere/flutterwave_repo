const jwt = require("jsonwebtoken");

const secret = process.env.jwtSecret || "97E3C1DF8C785D9E42217D47333B3DC8612685D03EEB52C1D40EBF7A411D8871";
const jwtExpirySeconds = (60 * 60 * 24);
const generateJWT = (username, accountType, userId) => {

  const token = jwt.sign({ username, accountType, userId }, secret, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });
  return token;
}

module.exports = {
  generateJWT,
  jwtExpirySeconds,
}