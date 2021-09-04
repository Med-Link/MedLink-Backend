// const e = require('cors');
const jwt = require('jsonwebtoken');

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

  const paymentstatus = 0;
  console.log(contactnumber);
  try {
    const checkoutorder = await pool.query(
      'INSERT INTO public.completedorder (medlistid, medlisttotal, deliverycost, servicecost, totalcost, paymentstatus, customerid, address, contactnumber) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      // eslint-disable-next-line max-len
      [medlistid, totalprice, deliverycost, servicecost, totalcost, paymentstatus, customerid, address, contactnumber],
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
  // console.log(contactnumber, address);
  const paymentstatus = 1;

  // eslint-disable-next-line camelcase
  if (status_code === '2') {
    try {
      const update = await pool.query(
        'UPDATE completedorder SET paymentstatus = $1 WHERE medlistid = $2', [
          paymentstatus, medlistid,
        ],
      );

      if (update) {
        // console.log (update);
        return res.status(200).json({
          message: 'payment succesfull',
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  } else {
    try {
      const deletecompletedorder = await pool.query(
        'DELETE FROM completedorder WHERE medlistid = $1', [
          medlistid,
        ],
      );

      if (deletecompletedorder) {
        return res.status(200).json({
          message: 'completed order deleted',
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
};

