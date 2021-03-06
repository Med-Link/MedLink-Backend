/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const pool = require('../../db/db');

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.admin WHERE email = $1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }
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
    res.cookie('token', token, { expiresIn: '6h' });
    return res.status(200).json({
      token,
      userdet,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.signout = (req, res) => {
  // res.clearCookie('token');
  res.status(200).json({
    message: 'Signout successfully...!',
  });
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

  const verify = jwt.verify(resetlink, process.env.PASSWORD_RESET);
  if (verify) {
    const bcryptPassword = bcrypt.hashSync(newpassword, 10);
    const userid = verify.payload.id;
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
