const jwt = require('jsonwebtoken');
const pool = require('../db/db');

exports.allorderbills = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  try {
    const getallbills = await pool.query(
      'SELECT order_medlist.medlistid, order_medlist.order_reqid, order_medlist.totalprice, order_medlist.pharmacyid, order_medlist.customerid, order_medlist.acceptstatus, pharmacy.name FROM public.order_medlist INNER JOIN public.pharmacy ON order_medlist.pharmacyid = pharmacy.pharmacyid WHERE customerid = $1 AND acceptstatus= $2', [
        customerid, false,
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
  // const token = req.headers.authorization.split(' ')[1];
  // const decoded = jwt.decode(token, process.env.JWT_SECRET);
  // const customerid = decoded.payload.id;

  const {
    medlistid,

  } = req.body;
  try {
    const getorderbill = await pool.query(
      'SELECT order_medlist.order_reqid, order_medlist.medlistid, order_medlist.totalprice, order_medlist.pharmacyid, order_medlist.acceptstatus, list_items.quantity, list_items.price, medicinebatch.batchid, medicines.medname, medicines.medid FROM public.order_medlist INNER JOIN public.list_items ON order_medlist.medlistid = list_items.medlistid INNER JOIN public.medicinebatch ON list_items.batchid = medicinebatch.batchid INNER JOIN public.medicines ON medicinebatch.medid = medicines.medid WHERE order_medlist.medlistid = $1 ', [
        medlistid,
        // customerid,
      ],
    );
    const { rows } = getorderbill;
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

exports.acceptorderbill = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  const {
    medlistid,

  } = req.body;

  try {
    const acceptbill = await pool.query(
      'UPDATE public.order_medlist SET acceptstatus = $1 WHERE medlistid = $2 AND customerid = $3', [
        1, medlistid, customerid,
      ],
    );
    // const { rows } = getorderbill;
    // console.log(getorderbill);
    if (acceptbill) {
      return res.status(200).json({
        message: 'order bill accepted success',
        // rows,

      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.acceptedbills = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  try {
    const getallbills = await pool.query(
      'SELECT order_medlist.medlistid, order_medlist.order_reqid, order_medlist.totalprice, order_medlist.acceptstatus, order_medlist.customerid, order_medlist.pharmacyid, pharmacy.name FROM public.order_medlist INNER JOIN public.pharmacy ON order_medlist.pharmacyid = pharmacy.pharmacyid WHERE customerid = $1 AND acceptstatus = $2', [
        customerid, true,
      ],
    );
    const { rows } = getallbills;

    if (getallbills) {
      return res.status(200).json({
        message: 'all accepted order bills listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.rejectbills = async (req, res) => {
  // const token = req.headers.authorization.split(' ')[1];
  // const decoded = jwt.decode(token, process.env.JWT_SECRET);
  // const customerid = decoded.payload.id;
  const {
    medlistid,

  } = req.body;

  try {
    const deleteitemlist = await pool.query(
      'DELETE FROM list_items WHERE medlistid = $1', [
        medlistid,
      ],
    );
    const rejectorderlist = await pool.query(
      'DELETE FROM order_medlist WHERE medlistid = $1', [
        medlistid,
      ],
    );

    if (rejectorderlist && deleteitemlist) {
      return res.status(200).json({
        message: 'order bill deleted success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
