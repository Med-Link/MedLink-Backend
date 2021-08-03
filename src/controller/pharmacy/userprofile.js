const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

exports.viewprofile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const pharmacy = await pool.query('SELECT firstName, lastName, email, adminid FROM public.pharmacy WHERE pharmacy.pharmacyid = $1',
      [pharmacyid]);

    const result = pharmacy.rows;

    if (pharmacy) {
      return res.status(201).json({
        message: 'pharmacy profile listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
