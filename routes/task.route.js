const express = require("express");
const Task = require("../models/task.model");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
router.use(express.json());

router.get("/", authMiddleware, async (req, res) => {
  const result = await Task.find()
    .populate("user", "email -_id")
    .select("created by user");
  return res.send(result);
});
router.post("/", authMiddleware, async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const task = await Task.create(req.body);

  return res.send(task);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const taskId = req.params.id;

  const result = await Task.findById(taskId);

  return res.send(result);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const body = req.body;
  const { error } = validateTask(body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const result = await Task.findById(taskId);
  if (!result) {
    return res.status(400).send("task not found");
  }
  Object.assign(result, body);
  await result.save();
  return res.send(result);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const user = await Task.findById(taskId);
  const result = await user.remove();
  return res.send(result);
});
const validateTask = (task) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    status: Joi.string().valid("To Do", "In Progress", "Done"),
  });
  return schema.validate(task);
};
module.exports = router;
