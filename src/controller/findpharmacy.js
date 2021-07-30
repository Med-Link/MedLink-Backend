// const jwt = require('jsonwebtoken');

const pool = require('../db/db');

exports.allpharmacies = async (req, res) => {
  try {
    const checkoutorder = await pool.query(
      'SELECT * FROM public.pharmacy',
    );

    if (checkoutorder) {
      return res.status(201).json({
        message: 'payment made success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.pharmacybydistrict = async (req, res) => {
  try {
    const checkoutorder = await pool.query(
      'SELECT * FROM public.pharmacy',
    );

    if (checkoutorder) {
      return res.status(201).json({
        message: 'payment made success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
