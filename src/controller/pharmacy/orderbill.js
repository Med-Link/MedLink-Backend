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
      const { batchid } = medlist[i];
      const { amount } = medlist[i];

      const senditemlist = pool.query(
        'INSERT INTO public.list_items( batchid, quantity, medlistid) VALUES ($1, $2, $3) RETURNING *',
        [batchid, amount, medlistid],
      );
      if (!senditemlist) {
        res.status(400).send('list adding error');
      }
      // }
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
      return res.status(201).json({
        message: 'all order bills listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.singleorderbills = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  const {
    medlistid,

  } = req.body;

  try {
    const getallbills = await pool.query(
      'SELECT * FROM public.order_medlist WHERE pharmacyid = $1 AND medlistid = $2', [
        pharmacyid, medlistid,
      ],
    );
    const { rows } = getallbills;

    if (getallbills) {
      return res.status(201).json({
        message: 'order bill listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
