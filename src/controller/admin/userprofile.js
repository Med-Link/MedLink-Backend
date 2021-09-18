/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const pool = require('../../db/db');

exports.viewprofile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const adminid = decoded.payload.id;

  try {
    const admin = await pool.query('SELECT firstName, lastName, email, adminid FROM public.admin WHERE admin.adminid = $1',
      [adminid]);

    const result = admin.rows;

    if (admin) {
      return res.status(200).json({
        message: 'admin profile listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
