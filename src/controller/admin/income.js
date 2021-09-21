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

exports.totalmonthlyincome = async (req, res) => {
  const income = await pool.query(`SELECT SUM(completedorder.servicecost)
  FROM completedorder
  WHERE paymentstatus = true AND EXTRACT(MONTH FROM completedorder.date)= EXTRACT(month FROM CURRENT_DATE)`, [
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

exports.customedaterangeincome = async (req, res) => {
  const {
    fromdate, todate,
  } = req.body;
  try {
    const customincome = await pool.query(
      ` SELECT completedorder.pharmacyid, SUM(completedorder.servicecost),pharmacy.name 
        FROM completedorder 
        INNER JOIN pharmacy ON completedorder.pharmacyid=pharmacy.pharmacyid 
        WHERE paymentstatus = true AND completedorder.date >= $1 AND completedorder.date<=$2
        GROUP BY completedorder.pharmacyid,pharmacy.name`,
      [fromdate, todate],
    );
    const result = customincome.rows;
    if (customincome) {
      return res.status(201).json({
        message: 'Income 555 Listed Successfully',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};