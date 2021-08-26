/* eslint-disable consistent-return */
const pool = require('../../db/db');

exports.addmedicine = async (req, res) => {
  const {
    brand, medname,
  } = req.body;

  try {
    const newUser = await pool.query(
      'INSERT INTO public.medicines ( brand, medname ) VALUES ($1, $2) RETURNING *',
      [brand, medname],
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
    const medicine = await pool.query('DELETE FROM public.medicines WHERE medid = $1', [
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

exports.updatemedicine = async (req, res) => {
  const {
    medid, newmedname
  } = req.body;

  try {
    const medupdate = await pool.query(
      'UPDATE public.medicines SET medname = $1 WHERE medid = $2',
      [newmedname, medid],
    );

    if (medupdate) {
      return res.status(200).json({
        message: 'medicine name edited successfully',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// exports.viewonemedicine  = (req, res) =>{
//   const {
//     medid,
//   } = req.body;

//   try {
//     const medicine = await pool.query('SELECT FROM public.medicines WHERE medid = $1', [
//       medid,
//     ]);

//     if (viewonemedicine) {
//       return res.status(201).json({
//         message: 'medicine found',
//       });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };