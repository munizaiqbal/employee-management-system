const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    validate: {
      validator: (v) => /^[0-9]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  dob: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
