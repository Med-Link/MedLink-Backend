const User = require("../../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, userdet) => {
    if (userdet)
      return res.status(400).json({
        message: "Pharmacy already registered",
      });
    const { firstName, lastName, email, contactNumber, password } = req.body;

    const _user = new User({
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      userName: Math.random().toString(),
      role: "pharmacy",
    });
    _user.save((error, userdet) => {
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
      if (userdet) {
        return res.status(201).json({
          message: "Pharmacy created success",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, userdet) => {
    if (error) return res.status(400).json({ error });
    if (userdet) {
      if (userdet.authenticate(req.body.password) && userdet.role === "pharmacy") {
        const token = jwt.sign({ _id: userdet._id, role: user.role }, process.env.JWT_SECRET, {
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


