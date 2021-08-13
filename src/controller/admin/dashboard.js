const pool = require('../../db/db');

exports.countcustomer = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT (*) FROM public.customers WHERE verifiedemail =$1 ',
      [1],
    );
    const row = result.rows[0].count;
    if (result) {
      return res.status(201).json({
        message: 'number of customers listed success',
        row,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
