const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, userdet) => {
    if (userdet)
      return res.status(400).json({
        message: "User already registered",
      });
    const { firstName, email, contactNumber, password } = req.body;

    const _user = new User({
      firstName,
      email,
      contactNumber,
      password,
      userName: Math.random().toString(),
    });

    _user.save((error, userdet) => {
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
      if (userdet) {
        return res.status(201).json({
          message: "user created success",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, userdet) => {
    if (error) return res.status(400).json({ error });
    if (userdet) {
      if (userdet.authenticate(req.body.password)) {
        const token = jwt.sign({ _id: userdet._id, role: userdet.role }, process.env.JWT_SECRET, {
          expiresIn: "6h",
        });
        const { _id, firstName, lastName, email, contactNumber, role, fullName } = userdet;
        res.status(200).json({
          token,
          userdet: {
            _id,
            firstName,
            lastName,
            email,
            contactNumber,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).json({
          message: "invalid password",
        });
      }
    } else {
      return res.status(400).json({ message: "something went wrong" });
    }
  });
};

