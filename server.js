const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const user = require("./routes/user.route");
const task = require("./routes/task.route");

const app = express();

var corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect("mongodb://localhost:27017/to-do-app")
  .then(() => {
    console.log("connet to DB success");
  })
  .catch((err) => {
    console.log(err);
  });
// task routes
app.use("/api/tasks", task);

//user routes
app.use("/", user);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
