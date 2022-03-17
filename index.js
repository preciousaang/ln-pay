require("dotenv").config();
let express = require("express");
let app = express();
require("./config/db");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./routes/index.routes"));

app.use((req, res, next) => {
  res.status(404).json({ message: "Routes does not exist" });
  next();
});

app.listen(3000, () => {
  console.log("App listening on post 3000");
});

module.exports = app;
