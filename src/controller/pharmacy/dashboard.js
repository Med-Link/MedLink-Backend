/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

exports.incomegrowth = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  // console.log(req);
  try {
    const income = await pool.query(
      ` SELECT SUM(medlisttotal),TO_CHAR( date, 'month') AS month 
        FROM completedorder 
        WHERE paymentstatus = true AND pharmacyid = $1
        GROUP BY TO_CHAR( date, 'month')`, [
        pharmacyid,
      ],
    );
    const result= income.rows;
    if (income) {
      return res.status(201).json({
        message: 'all Stocks listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.monthlyincome = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  // console.log(req);
  try {
    const income = await pool.query(
      ` SELECT SUM(medlisttotal) FROM completedorder WHERE paymentstatus = true AND EXTRACT(MONTH FROM completedorder.date)= EXTRACT(month FROM CURRENT_DATE) AND pharmacyid = $1 GROUP BY pharmacyid `, [pharmacyid,],
    );
    const result= income.rows;
    if (income) {
      return res.status(201).json({
        message: 'all Stocks listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.orderrequestsrate = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  // console.log(req);
  try {
    const income = await pool.query(
      ` SELECT COUNT(id),TO_CHAR( date, 'month') AS month 
        FROM order_req 
        WHERE pharmacyid = $1
        GROUP BY TO_CHAR( date, 'month')`, [
        pharmacyid,
      ],
    );
    const result= income.rows;
    if (income) {
      return res.status(201).json({
        message: 'all Stocks listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};