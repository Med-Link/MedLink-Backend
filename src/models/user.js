// const pool = require('../db');

// const findOne = await pool.query("SELECT * FROM users WHERE user_email = $1", [
//   email
// ]);

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const { Schema } = mongoose;
// const UserSchema = new Schema(

// UserSchema.virtual('password').set(function (password) {
//   this.hash_password = bcrypt.hashSync(password, 10);
// });

// UserSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// UserSchema.methods = {
//   authenticate(password) {
//     return bcrypt.compareSync(password, this.hash_password);
//   },
// };

// UserSchema.virtual('password');
// module.exports = mongoose.model('User', UserSchema);
