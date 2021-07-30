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

    // const jwtToken = jwtGenerator(newUser.rows[0].user_id);
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
    const allmedicine = await pool.query('SELECT * FROM public.medicine');

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

