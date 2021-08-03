const jwt = require('jsonwebtoken');

const pool = require('../db/db');

exports.viewprofile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  try {
    const customer = await pool.query('SELECT firstName, lastName, email, customerid FROM public.customer WHERE customer.customerid = $1',
      [customerid]);

    const result = customer.rows;

    if (customer) {
      return res.status(201).json({
        message: 'customer profile listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
