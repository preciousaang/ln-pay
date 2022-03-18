require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("./config/db");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./routes/index.routes"));

app.use((req, res, next) => {
  res.status(404).json({ message: "Routes does not exist" });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on post ${PORT}`);
});

module.exports = app;
