/* eslint-disable consistent-return */
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
      'INSERT INTO public.medicinebatch (pharmacyid, medid, quantity, price, expiredate, manufacdate, activestatus ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [pharmacyid, medid, quantity, price, expiredate, manufacdate,true],
    );

    if (newBatch) {
      return res.status(201).json({
        message: 'Stock listing added success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addcsv = async (req, res) => {
  const {
    csvarray
  } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  // console.log(csvarray);
  try {
    for (var i = 0; i < (csvarray.length-1); i++) {
      const newBatch = await pool.query(
        'INSERT INTO public.medicinebatch (pharmacyid, medid, quantity, price, expiredate, manufacdate,activestatus ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [pharmacyid, csvarray[i].medid, csvarray[i].quantity, csvarray[i].price, csvarray[i].expiredate, csvarray[i].manufacdate,true],
    );
      }
    if (i==csvarray.length-2) {
      return res.status(201).json({
        message: 'CSV file added successfully',
      });
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updatestock = async (req, res) => {
  const {
    batchid,
    quantity,
    price,
    expiredate,
    manufacdate,
  } = req.body;
  // console.log(req);
  try {
    const update = await pool.query(
      'UPDATE public.medicinebatch SET quantity = $1, price = $2, expiredate = $3, manufacdate = $4 WHERE batchid = $5', [
        quantity, price, expiredate, manufacdate, batchid,
      ],
    );

    if (update) {
      return res.status(201).json({
        message: 'Stock record updated success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.deletestock = async (req, res) => {
  const {
    batchid,
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  console.log(pharmacyid, batchid);
  try {
    const deleterecord = await pool.query(
      'UPDATE public.medicinebatch SET activestatus = $1 WHERE batchid = $2 AND pharmacyid = $3', [
        false, batchid, pharmacyid,
      ],
    );

    if (deleterecord) {
      return res.status(201).json({
        message: 'Stock record deleted success',
        // res,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewallstock = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  // console.log(req);
  try {
    const select = await pool.query(
      'SELECT * FROM public.medicinebatch, public.medicines WHERE medicinebatch.medid = medicines.medid AND pharmacyid = $1 AND activestatus =$2', [
        pharmacyid, true,
      ],
    );
    const { rows } = select;

    if (select) {
      return res.status(201).json({
        message: 'all Stocks listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewsinglestock = async (req, res) => {
  const {
    batchid,
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  // console.log(req);
  try {
    const selectone = await pool.query(
      'SELECT * FROM public.medicinebatch WHERE pharmacyid = $1 AND batchid = $2', [
        pharmacyid, batchid,
      ],
    );
    const { rows } = selectone;

    if (selectone) {
      return res.status(201).json({
        message: 'Single Stocks listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.listmedicine = async (req, res) => {
  try {
    const allmedicine = await pool.query('SELECT * FROM public.medicines');

    const result = allmedicine.rows;

    if (allmedicine) {
      return res.status(200).json({
        message: 'all medicine types listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewOutofStock = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  // console.log(req);
  try {
    const select = await pool.query(
      ` SELECT * 
        FROM (  SELECT medicines.medid,medicines.medname,medicines.brand,SUM(medicinebatch.quantity) as qty 
                FROM medicinebatch,medicines WHERE medicinebatch.medid = medicines.medid AND medicinebatch.pharmacyid =$1 
                GROUP BY medicines.medid) AS fullqty
      WHERE qty<=50`, 
      [
        pharmacyid,
      ],
    );
    const { rows } = select;

    if (select) {
      return res.status(201).json({
        message: 'all Stocks listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

