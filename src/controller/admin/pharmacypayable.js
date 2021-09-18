const pool = require('../../db/db');

exports.viewpayablepharmacy = async (req, res) => {
  const requests = await pool.query('SELECT completedorder.pharmacyid, SUM(completedorder.medlisttotal),pharmacy.name FROM completedorder INNER JOIN pharmacy ON completedorder.pharmacyid=pharmacy.pharmacyid WHERE pharmacypaid = $1 AND paymentstatus = $2 GROUP BY completedorder.pharmacyid,pharmacy.name', [
    false, true,
  ]);
  if (requests.rows.length === 0) {
    return res.status(400).json('server error');
  }
  const result = requests.rows;
  if (requests) {
    return res.status(200).json({
      message: 'Pharmacy signup request listed success',
      result,
    });
  }
  return res.status(400).json({ error: 'Server error' });
};

exports.pharmacypaid = async (req, res) => {
  const {
    pharmacyid,
  } = req.body;

  try {
    const pharmacypaid = await pool.query(
      'UPDATE public.completedorder SET pharmacypaid = $1 WHERE pharmacyid = $2', [
        true, pharmacyid,
      ],
    );
    if (pharmacypaid) {
      return res.status(200).json({
        message: 'pharmacy paid success',
        // rows,

      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
