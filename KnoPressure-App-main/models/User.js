const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Fix: Ensure password hashing always runs correctly
UserSchema.pre("save", async function (next) {
  const user = this;

  // ✅ Fix: Check if the password has changed
  if (!user.isModified("password")) {
    return next(); // Move to the next middleware
  }

  try {
    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(user.password, salt);
    next(); // ✅ Fix: Call next() after hashing
  } catch (err) {
    return next(err); // If error, pass it to Mongoose
  }
});

// ✅ Fix: Add error handling to verifyPassword
UserSchema.methods.verifyPassword = async function (plainTextPassword) {
  try {
    return await bcrypt.compare(plainTextPassword, this.password);
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return false; // Return false on error
  }
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
