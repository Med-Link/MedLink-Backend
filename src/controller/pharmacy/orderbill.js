const jwt = require('jsonwebtoken');
const pool = require('../../db/db');

exports.sendorderbill = async (req, res) => {
//   const medlist = [{batchid, amount},{batchid, amount}]
  const {
    orderreqid,
    totalprice,
    customerid,

  } = req.body;
  const payment = 0;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  // for (let i = 0; i < medlist.length; i++) {

  // }

  try {
    const sendmedlist = await pool.query(
      'INSERT INTO public.order_medlist( order_reqid, totalprice, pharmacyid, customerid, payment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [orderreqid, totalprice, pharmacyid, customerid, payment],
    );
    if (sendmedlist) {
      return res.status(201).json({
        message: 'medicine list sent success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
