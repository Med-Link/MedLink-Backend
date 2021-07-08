const nodemailer = require('nodemailer');
const pool = require('../../db/db');

exports.acceptadmin = async (req, res) => {
  const { adminid } = req.body;

  const user = await pool.query('SELECT * FROM public.admin WHERE adminid = $1', [
    adminid,
  ]);
  if (user.rows.length === 0) {
    return res.status(401).json('server error');
  }
  const emailaddress = user.rows[0].email;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'medlinkapp.info@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'medlinkapp.info@gmail.com',
    to: emailaddress,
    subject: 'MedLink Account Registration success!',
    html: `
    <h2>Your admin registration request to join MedLink is Accepted.</h2>
    `,
  };

  const sent = transporter.sendMail(mailOptions, (error, info) => {
    if (sent) {
      return res.status(401).json(error);
    }
    return res.status(201).json(`Email sent: ${info.response}`);
  });

  const accept = await pool.query('UPDATE public.admin SET activestatus = $1 WHERE adminid = $2', [
    1, adminid,
  ]);
  if (accept) {
    return res.status(201).json({
      message: 'Admin signup request accepted success',
    });
  }
  return res.status(401).json({ error: 'Server error' });
};

exports.rejectadmin = async (req, res) => {
  const { adminid, rejectmessage } = req.body;

  const user = await pool.query('SELECT * FROM public.admin WHERE adminid = $1', [
    adminid,
  ]);
  if (user.rows.length === 0) {
    return res.status(401).json('server error');
  }
  const emailaddress = user.rows[0].email;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'medlinkapp.info@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'medlinkapp.info@gmail.com',
    to: emailaddress,
    subject: 'MedLink Account Registration failed',
    html: `
    <h2>Your Admin registration request to join MedLink is rejected. please refer following guidelines</h2>
    <p> ${rejectmessage} </p>`,
  };

  const sent = transporter.sendMail(mailOptions, (error, info) => {
    if (sent) {
      return res.status(401).json(error);
    }
    return res.status(201).json(`Email sent: ${info.response}`);
  });

  const reject = await pool.query('DELETE FROM public.admin WHERE adminid = $1', [
    adminid,
  ]);
  if (reject) {
    return res.status(201).json({
      message: 'Admin signup request rejected success',
    });
  }
  return res.status(401).json({ error: 'Server error' });
};
