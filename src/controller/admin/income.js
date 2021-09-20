/* eslint-disable consistent-return */
const pool = require('../../db/db');

exports.viewmonthlyincome = async (req, res) => {
  const income = await pool.query(`SELECT completedorder.pharmacyid, SUM(completedorder.servicecost),pharmacy.name 
  FROM completedorder 
  INNER JOIN pharmacy ON completedorder.pharmacyid=pharmacy.pharmacyid 
  WHERE paymentstatus = true AND EXTRACT(MONTH FROM completedorder.date)= EXTRACT(month FROM CURRENT_DATE)
  GROUP BY completedorder.pharmacyid,pharmacy.name`, [
  ]);
  if (income.rows.length === 0) {
    return res.status(400).json('server error');
  }
  const result = income.rows;
  if (income) {
    return res.status(200).json({
      message: 'Pharmacy signup request listed success',
      result,
    });
  }
  return res.status(400).json({ error: 'Server error' });
};

