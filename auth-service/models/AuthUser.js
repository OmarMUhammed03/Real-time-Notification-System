const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AuthUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  roles: { type: [String], default: ["user"] },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

AuthUserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.hashedPassword);
};

module.exports = mongoose.model("AuthUser", AuthUserSchema);
