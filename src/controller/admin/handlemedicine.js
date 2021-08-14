/* eslint-disable consistent-return */
const pool = require('../../db/db');

exports.addmedicine = async (req, res) => {
  const {
    brandname, medname,
  } = req.body;

  try {
    const newUser = await pool.query(
      'INSERT INTO public.medicine ( brandname, medname ) VALUES ($1, $2) RETURNING *',
      [brandname, medname],
    );

    if (newUser) {
      return res.status(201).json({
        message: 'medicine type added success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewallmedicine = async (req, res) => {
  try {
    const allmedicine = await pool.query('SELECT * FROM public.medicines');

    const result = allmedicine.rows;

    if (allmedicine) {
      return res.status(201).json({
        message: 'all medicine types listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deletemedicine = async (req, res) => {
  const {
    medid,
  } = req.body;

  try {
    const medicine = await pool.query('DELETE FROM public.medicine WHERE medid = $1', [
      medid,
    ]);

    if (medicine) {
      return res.status(201).json({
        message: 'all medicine types listed success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
