const jwt = require('jsonwebtoken');
const pool = require('../../db/db');

exports.sendorderbill = async (req, res) => {
//   const medlist = [{batchid, amount},{batchid, amount}]
  const {
    orderreqid,
    totalprice,
    customerid,
    medlist,

  } = req.body;
  // const obj = JSON.stringify(medlist);

  // const jsonParsed = JSON.parse(obj);
  // const json = $.parseJSON(medlist);
  console.log(medlist[0].batchid);
  // const med = JSON.parse(JSON.stringify(medlist));
  // var a=[];
  // const list = (med.columns);

  const payment = 0;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  // const itemlist = async () => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < medlist.length; i++) {
    const { batchid } = medlist[i];
    const { amount } = medlist[i];
    // const batchid = 20;
    // const amount = 20;

    const sendmedlist = pool.query(
      'INSERT INTO public.list_items( batchid, quantity, order_reqid) VALUES ($1, $2, $3) RETURNING *',
      [batchid, amount, orderreqid],
    );
    if (!sendmedlist) {
      res.status(400).send('list adding error');
    }
    // }
  }
  try {
    const sendmedlist = await pool.query(
      'INSERT INTO public.order_medlist( order_reqid, totalprice, pharmacyid, customerid, payment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [orderreqid, totalprice, pharmacyid, customerid, payment],
    );
    if (sendmedlist && sendmedlist) {
      return res.status(201).json({
        message: 'medicine list sent success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
