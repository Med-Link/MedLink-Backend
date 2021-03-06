/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const pool = require('../../db/db');

exports.addnewAdmin = async (req, res) => {
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
    const bcryptPassword = await bcrypt.hashSync(password, 10);

    const newUser = await pool.query(
      'INSERT INTO public.admin ( email, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, bcryptPassword],
    );

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

exports.viewalladmins = async (req, res) => {
  try {
    const alladmins = await pool.query('SELECT firstname, lastname, email, adminid FROM public.admin');

    const result = alladmins.rows;

    if (alladmins) {
      return res.status(201).json({
        message: 'all admins listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
