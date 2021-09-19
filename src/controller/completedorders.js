// const e = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const pool = require('../db/db');

// >30km = 150
// <30km = 300
// eslint-disable-next-line consistent-return
exports.findtotal = async (req, res) => {
  const {
    latitude, longitude, pharmacyid, totalprice,
  } = req.body;

  // const paymentstatus = 1;

  try {
    const distance = await pool.query(

      `SELECT *, 
              (
                  (
                      (
                          acos(
                              sin(( ${latitude} * pi() / 180))
                              *
                              sin(( latitude * pi() / 180)) + cos(( ${latitude} * pi() /180 ))
                              *
                              cos(( latitude * pi() / 180)) * cos((( ${longitude} - longitude) * pi()/180)))
                      ) * 180/pi()
                  ) * 60 * 1.1515 * 1.609344
              )
          as distance FROM public.pharmacy
          WHERE pharmacyid = ${pharmacyid};`,

    );
    const distanceresult = distance.rows[0].distance;
    // console.log(result.latitude);
    let deliverycost = 0;

    if (distanceresult > 30) {
      deliverycost = 300;
    } else {
      deliverycost = 150;
    }
    const servicecost = Math.ceil(totalprice * 0.05);
    // console.log(typeof(deliverycost))
    const totalcost = (parseInt(totalprice, 10) + deliverycost + servicecost);

    if (distance) {
      return res.status(200).json({
        message: 'pharmacies distance calculated success',
        totalprice,
        deliverycost,
        servicecost,
        totalcost,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// exports.completeorder = async (req, res) => {
//   const {
//     latitude, longitude, medlistid,
//   } = req.body;

//   const token = req.headers.authorization.split(' ')[1];
//   const decoded = jwt.decode(token, process.env.JWT_SECRET);
//   const customerid = decoded.payload.id;

//   const pharmacylocation = await pool.query(
//     'SELECT latitude, longitude FROM public.pharmacy INNER JOIN public.order_medlist ON pharmacy.pharmacyid = order_medlist.pharmacyid WHERE medlistid = $1 AND customerid = $2', [
//       medlistid, customerid,
//     ],
//   );
//   const pharmacylatitude = pharmacylocation.rows[0].latitude;
//   const pharmacylongitude = pharmacylocation.rows[0].longitude;

//   // function to find pharmacy cord - deliverycord destance = dis should come here
//   const dis = parseInt(deliverycoord, 10);

//   let deliverycost = 0;

//   if (dis <= 30) {
//     deliverycost = 150;
//   } else {
//     deliverycost = 300;
//   }

//   //     console.log(deliverycost);

//   try {
//     const getmedlistid = await pool.query(
//       'SELECT totalprice FROM public.order_medlist WHERE medlistid = $1 AND customerid = $2', [
//         medlistid, customerid,
//       ],
//     );
//     const medlisttotal = getmedlistid.rows[0].totalprice;
//     const servicecost = Math.ceil(getmedlistid.rows[0].totalprice * 0.05);

//     const totalcost = servicecost + deliverycost + medlisttotal;
//     const paymentstatus = 0;

//     const completeorder = await pool.query(
//       'INSERT INTO public.completedorder (medlistid, medlisttotal, deliverycost, servicecost, totalcost, paymentstatus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//       [medlistid, medlisttotal, deliverycost, servicecost, totalcost, paymentstatus],
//     );
//     const result = completeorder.rows;

//     if (completeorder) {
//       return res.status(201).json({
//         message: 'orders listed success',
//         result,
//       });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

exports.completeorder = async (req, res) => {
  const {
    medlistid, totalcost, deliverycost, servicecost, totalprice, address, contactnumber,
  } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;

  // const paymentstatus = false;
  // const pharmacypaid = false;
  const datetime = new Date();

  const pharmacy = await pool.query(
    'SELECT pharmacyid FROM order_medlist WHERE medlistid = $1', [
      medlistid,
    ],
  );
  const { pharmacyid } = pharmacy.rows[0];
  try {
    const checkoutorder = await pool.query(
      'INSERT INTO public.completedorder (medlistid, medlisttotal, deliverycost, servicecost, totalcost, paymentstatus, customerid, address, contactnumber, pharmacyid, pharmacypaid, date, shipped) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      // eslint-disable-next-line max-len
      [medlistid, totalprice, deliverycost, servicecost, totalcost, false, customerid, address, contactnumber, pharmacyid, false, datetime, false],
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

exports.checkout = async (req, res) => {
  const {
    // eslint-disable-next-line camelcase
    medlistid, status_code,
  } = req.body;
  // eslint-disable-next-line camelcase
  if (status_code === '2') {
    try {
      const update = await pool.query(
        'UPDATE completedorder SET paymentstatus = $1 WHERE medlistid = $2', [
          true, medlistid,
        ],
      );
      const details = await pool.query('SELECT * FROM public.completedorder WHERE paymentstatus = $1 AND medlistid = $2',
        [true, medlistid]);
      // if (update) {
      const reducestock = await pool.query(
        'UPDATE medicinebatch SET quantity=medicinebatch.quantity-list_items.quantity FROM list_items WHERE medicinebatch.batchid=list_items.batchid AND medlistid=$1', [
          medlistid,
        ],
      );
      const updatemedlist = await pool.query(
        'UPDATE order_medlist SET acceptstatus = $1 WHERE medlistid = $2', [
          true, medlistid,
        ],
      );
      if (!update) {
        return res.status(401).send('Server error');
      }
      if (!reducestock) {
        return res.status(401).send('Server error');
      }
      if (!updatemedlist) {
        return res.status(401).send('Server error');
      }
      // }
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'medlinkapp.info@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: 'medlinkapp.info@gmail.com',
        to: process.env.DELIVERY_EMAIL,
        subject: 'MedLink Account Order Delivery',
        text: 'Order delivery details are listed',
        html: `
        <h2>Order delivery details</h2>
        <p> address :${details.address} </p> <p>contact number:  ${details.contactnumber} </p> <p>order number:  ${details.orderid} </p>`,
      };

      const sent = transporter.sendMail(mailOptions, (error) => {
        if (!sent) {
          return res.status(401).json(error);
        }
        return 'order delivery email sent';
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  } else {
    console.error('payment error');
    res.status(500).send('Server error');
  }
};
