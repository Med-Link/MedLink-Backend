/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const pool = require('../../db/db');

exports.sendorderbill = async (req, res) => {
  const {
    orderreqid,
    totalprice,
    customerid,
    medlist,

  } = req.body;

  const acceptstatus = 0;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  // eslint-disable-next-line no-plusplus
  try {
    const sendmedlist = await pool.query(
      'INSERT INTO public.order_medlist( order_reqid, totalprice, pharmacyid, customerid, acceptstatus) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [orderreqid, totalprice, pharmacyid, customerid, acceptstatus],
    );
    const { medlistid } = sendmedlist.rows[0];
    for (let i = 0; i < medlist.length; i++) {
      // const itemsfind = async () => {
      const { batchid } = medlist[i];
      const { amount } = medlist[i];
      // eslint-disable-next-line no-await-in-loop
      const selectunitprice = await pool.query(
        'SELECT price FROM public.medicinebatch WHERE batchid = $1', [
          batchid,
        ],
      );

      const x = parseInt(amount, 10);

      const price = x * selectunitprice.rows[0].price;

      // eslint-disable-next-line no-await-in-loop
      const senditemlist = await pool.query(
        'INSERT INTO public.list_items( batchid, quantity, medlistid, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [batchid, amount, medlistid, price],
      );
      if (!senditemlist) {
        res.status(400).send('list adding error');
      }
    }
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

exports.allorderbills = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const getallbills = await pool.query(
      'SELECT * FROM public.order_medlist WHERE pharmacyid = $1', [
        pharmacyid,
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
  const pharmacyid = decoded.payload.id;

  const {
    medlistid,

  } = req.body;

  try {
    const getorderbill = await pool.query(
      'SELECT order_medlist.order_reqid, order_medlist.totalprice, order_medlist.customerid, order_medlist.acceptstatus, list_items.quantity, list_items.price, medicinebatch.batchid, medicines.medname, medicines.medid FROM public.order_medlist INNER JOIN public.list_items ON order_medlist.medlistid = list_items.medlistid INNER JOIN public.medicinebatch ON list_items.batchid = medicinebatch.batchid INNER JOIN public.medicines ON medicinebatch.medid = medicines.medid WHERE order_medlist.medlistid = $1 AND order_medlist.pharmacyid = $2', [
        medlistid,
        pharmacyid,
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

