const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   maxlength:50,
    //   trim: true,
    //   required: true
    // },
    // lastname: {
    //   type:String,
    //   trim: true,
    //   maxlength: 50
    // },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    email: {
      type: String,
      trim:true,
      required: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      minglength: 6,
      trim: true,
      required: true
    },
    // phone: {
    //   type: String,
    //   // unique: true,
    //   trim: true,
    // },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // role: {
    //   type: String,
    //   default: 'user',
    //   enum: ['user', 'admin', 'superadmin'],
    // },
    // emailVerified: {
    //     type: Boolean,
    //     default: false,
    //     required: true
    // },
    image: { type: String },
  },
  { timestamps: true },
  { strict: false }
);

const userModel = mongoose.model("User", UserSchema);
mongoose.model('User').schema.add({
  name: {
    type: String,
    maxlength:50,
    trim: true,
    required: true
  },
  lastname: {
    type:String,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    // unique: true,
    trim: true,
  },
   emailVerified: {
        type: Boolean,
        default: false,
        required: true
    },
});

module.exports = userModel;
