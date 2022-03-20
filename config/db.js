const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected", function () {
  console.log("DB conected");
});

mongoose.connection.on("error", function (err) {
  console.log("DB connection failed: " + err);
});

module.exports = mongoose;
