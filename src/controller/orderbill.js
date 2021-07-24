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

exports.singleorderbill = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  const {
    medlistid,

  } = req.body;

  try {
    const getorderbill = await pool.query(
      'SELECT order_medlist.order_reqid, order_medlist.totalprice, order_medlist.pharmacyid, order_medlist.acceptstatus, list_items.quantity, list_items.price, medicinebatch.batchid, medicines.medname, medicines.medid FROM public.order_medlist INNER JOIN public.list_items ON order_medlist.medlistid = list_items.medlistid INNER JOIN public.medicinebatch ON list_items.batchid = medicinebatch.batchid INNER JOIN public.medicines ON medicinebatch.medid = medicines.medid WHERE order_medlist.medlistid = $1 AND order_medlist.customerid = $2', [
        medlistid,
        customerid,
      ],
    );
    const { rows } = getorderbill;
    console.log(getorderbill);
    if (getorderbill) {
      return res.status(200).json({
        message: 'order bill listed success',
        rows,

      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
