const User = require("../../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, userdet) => {
    if (userdet)
      return res.status(400).json({
        message: "Pharmacy already registered",
      });
    const { firstName, lastName, email, password } = req.body;

    const _user = new User({
      firstName,
      lastName,
      email,
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
        const token = jwt.sign({ _id: userdet._id }, process.env.JWT_SECRET, {
          expiresIn: "6h",
        });
        const { _id, firstName, lastName, email, role, fullName } = userdet;
        res.status(200).json({
          token,
          userdet: {
            _id,
            firstName,
            lastName,
            email,
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

exports.requireSignin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
  // jwt.decode()
};
