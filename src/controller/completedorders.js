// const e = require('cors');
const jwt = require('jsonwebtoken');

const pool = require('../db/db');

// >30km = 150
// <30km = 300
exports.completeorder = async (req, res) => {
  const {
    deliverycoord, medlistid,
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  const pharmacylocation = await pool.query(
    'SELECT location FROM public.pharmacy INNER JOIN public.order_medlist ON pharmacy.pharmacyid = order_medlist.pharmacyid WHERE medlistid = $1 AND customerid = $2', [
      medlistid, customerid,
    ],
  );
  const pharmacycoord = pharmacylocation.rows[0].location;

  // function to find pharmacy cord - deliverycord destance = dis should come here
  const dis = parseInt(deliverycoord, 10);

  let deliverycost = 0;

  if (dis <= 30) {
    deliverycost = 150;
  } else {
    deliverycost = 300;
  }

  //     console.log(deliverycost);

  try {
    const getmedlistid = await pool.query(
      'SELECT totalprice FROM public.order_medlist WHERE medlistid = $1 AND customerid = $2', [
        medlistid, customerid,
      ],
    );
    const medlisttotal = getmedlistid.rows[0].totalprice;
    const servicecost = Math.ceil(getmedlistid.rows[0].totalprice * 0.05);

    const totalcost = servicecost + deliverycost + medlisttotal;
    const paymentstatus = 0;

    const completeorder = await pool.query(
      'INSERT INTO public.completedorder (medlistid, medlisttotal, deliverycost, servicecost, totalcost, paymentstatus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [medlistid, medlisttotal, deliverycost, servicecost, totalcost, paymentstatus],
    );
    const result = completeorder.rows;

    if (completeorder) {
      return res.status(201).json({
        message: 'orders listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.checkout = async (req, res) => {
  const {
    medlistid,
  } = req.body;

  const paymentstatus = 1;

  try {
    const checkoutorder = await pool.query(
      'UPDATE public.completedorder SET paymentstatus = $1 WHERE medlistid = $2',
      [paymentstatus, medlistid],
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
