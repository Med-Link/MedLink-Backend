const Order = require('../models/order');

exports.addOrder = (req, res) => {
  const {
    description, amount, address, contactNumber, addedBy,
  } = req.body;

  const prescriptionUrl = req.file.location;
  const prescriptionName = req.file.key;

  // let prescription=req.file.map(file);
  // if (req.file.length > 0) {
  //    req.files.map((file) => {
  //     return { precription: file.location };
  //   });
  // }

  const order = new Order({
    description,
    prescriptionName,
    prescriptionUrl,
    amount,
    address,
    contactNumber,
    addedBy: req.user._id,
  });

  // const orderobj= {
  //       description:req.body.description,
  //       prescription:req.body.prescription,
  //       amount:req.body.amount,
  //       address:req.body.address,
  //       contactNumber:req.body.contactNumber,
  //       addedBy:req.user._id
  // }

  // const ord = new Order(orderobj);

  order.save((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      return res.status(201).json({ order, files: req.files });
    }
    console.log(order);
  });
};
exports.getOrders = (req, res) => {
  Order.find({}).exec((error, orders) => {
    if (error) return res.status(400).json({ error });
    if (orders) {
      return res.status(201).json({ orders });
    }
  });
};
