const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeaders = req.headers["authorization"];

  const token = authHeaders && authHeaders.split(" ")[1];

  if (!token)
    return res.status(401).json({
      messeage: "Null key",
    });
  try {
    const payload = jwt.verify(token, "jwtSecretKey");

    req.user = payload;

    next();
  } catch (error) {
    res.status(500).json({
      messeage: "Key is invalid",
    });
  }
};
