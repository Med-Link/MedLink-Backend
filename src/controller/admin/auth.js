// const jwt = require('jsonwebtoken');
// const User = require('../../models/user');

// exports.signup = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, userdet) => {
//     if (userdet) {
//       return res.status(400).json({
//         message: 'Admin already registered',
//       });
//     }
//     const {
//       firstName, lastName, email, contactNumber, password,
//     } = req.body;

//     const _user = new User({
//       firstName,
//       lastName,
//       email,
//       contactNumber,
//       activeStatus: 1,
//       password,
//       userName: Math.random().toString(),
//       role: 'admin',
//     });
//     _user.save((error, userdet) => {
//       if (error) {
//         return res.status(400).json({
//           message: error,
//         });
//       }
//       if (userdet) {
//         return res.status(201).json({
//           message: 'Admin created success',
//         });
//       }
//     });
//   });
// };
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const jwtGenerator = require('../utils/jwtGenerator');
const User = require('../../models/user');
const pool = require('../../db/db');

exports.signup = async (req, res) => {
  // User.findOne({ email: req.body.email }).exec((error, userdet) => {
  const {
    email, firstName, lastName, password,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.admin WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('admin already exist!');
    }

    // const salt = bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hashSync(password, 10);

    const newUser = await pool.query(
      'INSERT INTO public.admin ( email, firstname, lastname,  password) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, bcryptPassword],
    );

    // const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    if (newUser) {
      return res.status(201).json({
        message: 'admin created success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.admin WHERE email = $1', [
      email,
    ]);
    // const role = customer;
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password,
    );

    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }
    const payload = { id: user.rows[0].adminid, role: 'admin' };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { noTimestamp: true, expiresIn: '6h' });
    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// exports.signin = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, userdet) => {
//     if (error) return res.status(400).json({ error });
//     if (userde

// exports.signin = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, userdet) => {
//     if (error) return res.status(400).json({ error });
//     if (userdet) {
//       if (userdet.authenticate(req.body.password) && userdet.role === 'admin') {
//         const token = jwt.sign({ _id: userdet._id, role: user.role }, process.env.JWT_SECRET, {
//           expiresIn: '6h',
//         });
//         const {
//           _id, firstName, lastName, email, contactNumber, role, fullName,
//         } = userdet;
//         res.status(200).json({
//           token,
//           userdet: {
//             _id,
//             firstName,
//             lastName,
//             email,
//             contactNumber,
//             role,
//             fullName,
//           },
//         });
//       } else {
//         return res.status(400).json({
//           message: 'invalid password',
//         });
//       }
//     } else {
//       return res.status(400).json({ message: 'something went wrong' });
//     }
//   });
// };
