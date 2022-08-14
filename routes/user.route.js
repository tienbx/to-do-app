const express = require("express");
const Joi = require("joi");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const router = express.Router();
router.use(express.json());

router.get("/api/users", async (req, res) => {
  const result = await User.find();
  return res.send(result);
});

router.post("/api/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.create(req.body);

  return res.send(user);
});

router.post("/api/login", async (req, res) => {
  const result = await User.findOne({
    email: req.body.email,
  });
  if (!result) {
    return res.status(400).send("invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    result.password
  );
  if (!isValidPassword) {
    return res.status(400).send("invalid email or password");
  }
  const token = result.generateAuthToken();
  return res.send(token);
});

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6),
  });
  return schema.validate(user);
};

module.exports = router;
