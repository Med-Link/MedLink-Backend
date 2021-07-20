const jwt = require('jsonwebtoken');
const pool = require('../../db/db');

exports.addstock = async (req, res) => {
  const {
    medid,
    quantity,
    price,
    expiredate,
    manufacdate,
  } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const newBatch = await pool.query(
      'INSERT INTO public.medicinebatch (pharmacyid, medid, quantity, price, expiredate, manufacdate ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [pharmacyid, medid, quantity, price, expiredate, manufacdate],
    );

    if (newBatch) {
      return res.status(201).json({
        message: 'Stock updated success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
