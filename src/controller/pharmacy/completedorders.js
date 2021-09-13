/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

exports.viewallcloseddeals = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const pharmacyid = decoded.payload.id;
  
    try {
      const alldeals = await pool.query('SELECT * FROM public.completedorder, public.order_medlist, public.customers WHERE completedorder.orderid=order_medlist.order_reqid AND order_medlist.customerid=customers.customerid AND pharmacyid = $1', 
      [pharmacyid]);
  
      const result = alldeals.rows;
  
      if (alldeals) {
        return res.status(200).json({
          message: 'all cloased deals listed success',
          result,
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

  exports.countcloseddeals = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const pharmacyid = decoded.payload.id;
  
    try {
      const alldeals = await pool.query('SELECT count(orderid) FROM public.completedorder, public.order_medlist, public.customers WHERE completedorder.orderid=order_medlist.order_reqid AND order_medlist.customerid=customers.customerid AND pharmacyid = $1', 
      [pharmacyid]);
  
      const result = alldeals.rows;
  
      if (alldeals) {
        return res.status(200).json({
          message: 'all cloased deals listed success',
          result,
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };  
  