const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const jwtGenerator = require('../utils/jwtGenerator');
// const User = require('../models/user');
const pool = require('../db/db');

// eslint-disable-next-line consistent-return
exports.signup = async (req, res) => {
  const {
    email, firstName, lastName, password,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.customers WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('User already exist!');
    }

    // const salt = bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hashSync(password, 10);

    const newUser = await pool.query(
      'INSERT INTO public.customers ( email, firstname, lastname,  password) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, bcryptPassword],
    );

    // const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    if (newUser) {
      return res.status(201).json({
        message: 'user created success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// eslint-disable-next-line consistent-return
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.customers WHERE email = $1', [
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
    const userdet = user.rows;
    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }
    const payload = { id: user.rows[0].customerid, role: 'customer' };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { noTimestamp: true, expiresIn: '6h' });
    return res.json({
      token,
      userdet,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT customerid FROM public.customers WHERE email = $1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('User from this email does not exist');
    }
    const payload = { id: user.rows[0].customerid };
    // console.log(user.rows[0].customerid);
    const token = jwt.sign({ payload }, process.env.PASSWORD_RESET, { noTimestamp: true, expiresIn: '20m' });
    if (token) {
      return res.status(201).json({
        message: 'Reset link sent', token,
      });
    }
    return token;
    // const data = {
    //   from: 'noreply@medlink.com',
    //   to: user.email,
    //   subject: 'Account Activation Link',
    //   html:  <h2>Please click on link to reset your password</h2>
    //       <p>${process.env.PASSWORD_RESET}/resetpassword/${token}</p>
    // };
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetpassword = async (req, res) => {
  const { resetlink, newpassword } = req.body;

  // console.log(resetlink);
  const verify = jwt.verify(resetlink, process.env.PASSWORD_RESET);
  if (verify) {
    const bcryptPassword = bcrypt.hashSync(newpassword, 10);
    // const decoded = jwt.decode(resetLink, process.env.PASSWORD_RESET);
    const userid = verify.payload.id;
    // console.log(userid);
    const user = await pool.query('SELECT * FROM public.customers WHERE customerid = $1', [
      userid,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid reset link');
    }
    const resetpass = pool.query('UPDATE public.customers SET password = $1 WHERE customerid = $2', [
      bcryptPassword, userid,
    ]);
    if (resetpass) {
      return res.status(201).json({
        message: 'user password changed success',
      });
    }
    return res.status(401).json({ error: 'Error in reseting password' });
  }
  return res.status(401).json({ error: 'Reset link expired' });

  //  else {
  //   return res.status(401).json('Authentication error');
  // }
};

// exports.signin = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, userdet) => {
//     if (error) return res.status(400).json({ error });
//     if (userdet) {
//       if (userdet.authenticate(req.body.password)) {
// eslint-disable-next-line max-len
//         const token = jwt.sign({ _id: userdet._id, role: userdet.role }, process.env.JWT_SECRET, {
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
