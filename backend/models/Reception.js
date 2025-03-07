const mongoose = require("mongoose");
const receptionSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
});
module.exports = mongoose.model("Reception", receptionSchema);
