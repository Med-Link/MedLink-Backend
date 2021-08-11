const nodemailer = require('nodemailer');
const pool = require('../../db/db');

exports.acceptpharmacy = async (req, res) => {
  const { pharmacyid } = req.body;

  const user = await pool.query('SELECT * FROM public.pharmacy WHERE pharmacyid = $1', [
    pharmacyid,
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
    <h2>Your pharmacy registration request to join MedLink is Accepted.</h2>
    `,
  };

  const sent = transporter.sendMail(mailOptions, (error, info) => {
    if (sent) {
      return res.status(401).json(error);
    }
    return res.status(201).json(`Email sent: ${info.response}`);
  });

  const accept = await pool.query('UPDATE public.pharmacy SET activestatus = $1 WHERE pharmacyid = $2', [
    1, pharmacyid,
  ]);
  if (accept) {
    return res.status(201).json({
      message: 'Pharmacy signup request accepted success',
    });
  }
  return res.status(401).json({ error: 'Server error' });
};

exports.rejectpharmacy = async (req, res) => {
  const { pharmacyid, rejectmessage } = req.body;

  const user = await pool.query('SELECT * FROM public.pharmacy WHERE pharmacyid = $1', [
    pharmacyid,
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
    <h2>Your pharmacy registration request to join MedLink is rejected. please refer following guidelines</h2>
    <p> ${rejectmessage} </p>`,
  };

  const sent = transporter.sendMail(mailOptions, (error, info) => {
    if (sent) {
      return res.status(401).json(error);
    }
    return res.status(201).json(`Email sent: ${info.response}`);
  });

  const reject = await pool.query('DELETE FROM public.pharmacy WHERE pharmacyid = $1', [
    pharmacyid,
  ]);
  if (reject) {
    return res.status(201).json({
      message: 'Pharmacy signup request rejected success',
    });
  }
  return res.status(401).json({ error: 'Server error' });
};

exports.viewpharmacyrequests = async (req, res) => {
  const requests = await pool.query('SELECT * FROM public.pharmacy WHERE activestatus = $1', [
    0,
  ]);
  if (requests.rows.length === 0) {
    return res.status(401).json('server error');
  }
  const result = requests.rows;
  if (requests) {
    return res.status(200).json({
      message: 'Pharmacy signup request listed success',
      result,
    });
  }
  return res.status(401).json({ error: 'Server error' });
};
