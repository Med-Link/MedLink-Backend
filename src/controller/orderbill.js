const jwt = require('jsonwebtoken');
const pool = require('../db/db');

exports.allorderbills = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  try {
    const getallbills = await pool.query(
      'SELECT * FROM public.order_medlist WHERE customerid = $1', [
        customerid,
      ],
    );
    const { rows } = getallbills;

    if (getallbills) {
      return res.status(200).json({
        message: 'all order bills listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
