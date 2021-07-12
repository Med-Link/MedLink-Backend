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
const nodemailer = require('nodemailer');
// const jwtGenerator = require('../utils/jwtGenerator');
// const User = require('../../models/user');
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
    const activestatus = 0;
    // const salt = bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hashSync(password, 10);

    const newUser = await pool.query(
      'INSERT INTO public.admin ( email, firstname, lastname, activestatus, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, firstName, lastName, activestatus, bcryptPassword],
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
    // if (user.rows[0].activeStatus === 0) {
    //   return res.status(401).json('Signup request not accepted ');
    // }
    const userdet = user.rows;
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
      userdet,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  const user = await pool.query('SELECT adminid FROM public.admin WHERE email = $1', [
    email,
  ]);
  if (user.rows.length === 0) {
    return res.status(401).json('User from this email does not exist');
  }
  const payload = { id: user.rows[0].adminid };
  // console.log(user.rows[0].customerid);
  const token = jwt.sign({ payload }, process.env.PASSWORD_RESET, { noTimestamp: true, expiresIn: '20m' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'medlinkapp.info@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'medlinkapp.info@gmail.com',
    to: email,
    subject: 'MedLink Account password Reset Link',
    text: 'Click the link below to login to your MedLink account',
    html: `
    <h2>Click the link below to login to your MedLink account</h2>
    <p> ${process.env.CLIENT_URL}/resetpassword/${token} </p>`,
  };

  const sent = transporter.sendMail(mailOptions, (error, info) => {
    if (sent) {
      return res.status(401).json(error);
    }
    return res.status(201).json(`Email sent: ${info.response}`);
  });
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
    const user = await pool.query('SELECT * FROM public.admin WHERE adminid = $1', [
      userid,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid reset link');
    }
    const resetpass = pool.query('UPDATE public.admin SET password = $1 WHERE adminid = $2', [
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
};
