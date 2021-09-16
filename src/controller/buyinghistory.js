const jwt = require('jsonwebtoken');

const pool = require('../db/db');

exports.buyinghistory = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  try {
    const getorderhistory = await pool.query(
      'SELECT * FROM public.completedorder INNER JOIN public.pharmacy ON completedorder.pharmacyid = pharmacy.pharmacyid WHERE customerid = $1 AND paymentstatus = $2', [
        customerid, true,
      ],
    );
    if (getorderhistory) {
      return res.status(201).json({
        message: 'order history listed',
        getorderhistory,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
