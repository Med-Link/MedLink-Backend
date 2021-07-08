const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// const User = require('../../models/user');
const pool = require('../../db/db');

// eslint-disable-next-line consistent-return
exports.signup = async (req, res) => {
  // User.findOne({ email: req.body.email }).exec((error, userdet) => {
  const {
    email, name, contactNumber, password,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.pharmacy WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('pharmacy already exist!');
    }
    let regDocs = [];

    if (req.files.length > 0) {
      regDocs = req.files.map((file) => ({ img: file.location }));
    }
    const payload = { email };
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
      subject: 'MedLink Account Email verification Link',
      text: 'Click the link below to verify your Email',
      html: `
      <h2>Click the link below to verify email</h2>
      <p> ${process.env.CLIENT_URL}/${token} </p>`,
    };

    const sent = transporter.sendMail(mailOptions, (error) => {
      if (sent) {
        return res.status(401).json(error);
      }
    });

    // const salt = bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hashSync(password, 10);
    const activeStatus = 0;
    const verifiedemail = 0;
    let names = [];
    names = regDocs.map((item) => item.img);

    const newUser = await pool.query(
      'INSERT INTO public.pharmacy ( email, name, contactnumber, activestatus, verifiedemail, document1, document2, document3, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [email, name, contactNumber, activeStatus, verifiedemail, names[0], names[1], names[2], bcryptPassword],
    );
    // const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    if (newUser) {
      return res.status(201).json({
        message: 'pharmacy created success',
        verifytoken: token,
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
    const user = await pool.query('SELECT * FROM public.pharmacy WHERE email = $1', [
      email,
    ]);
    // const role = customer;
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }
    if (user.rows[0].activeStatus === 0) {
      return res.status(401).json('Signup request not accepted ');
    }
    if (user.rows[0].verifiedemail === false) {
      return res.status(401).json('Please verify your email ');
    }
    const userdet = user.rows;
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password,
    );

    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }
    const payload = { id: user.rows[0].pharmacyid, role: 'pharmacy' };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { noTimestamp: true, expiresIn: '6h' });
    return res.status(201).json({
      token,
      userdet,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyemail = async (req, res) => {
  const { token } = req.body;
  const verify = jwt.verify(token, process.env.PASSWORD_RESET);
  const useremail = verify.payload.email;

  const user = await pool.query('UPDATE public.pharmacy SET verifiedemail = $1 WHERE email = $2', [
    1, useremail,
  ]);
  if (user) {
    return res.status(201).json('User email verified');
  }
  return res.status(401).json('verification failed');
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  const user = await pool.query('SELECT customerid FROM public.pharmacy WHERE email = $1', [
    email,
  ]);
  if (user.rows.length === 0) {
    return res.status(401).json('User from this email does not exist');
  }
  const payload = { id: user.rows[0].pharmacyid };
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
    const user = await pool.query('SELECT * FROM public.pharmacy WHERE pharmacyid = $1', [
      userid,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid reset link');
    }
    const resetpass = pool.query('UPDATE public.pharmacy SET password = $1 WHERE pharmacyid = $2', [
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
