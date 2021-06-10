const Order = require('../models/order');


exports.addOrder = (req,res) => {

      const orderobj= {
            description:req.body.description,
            amount:req.body.amount,
            address:req.body.address,
            contactNumber:req.body.contactNumber
      }

      const ord = new Order(orderobj);

      ord.save((error, order)=>{
            if(error) return res.status(400).json({ error});
            if(order){
                  return res.status(201).json({order});
            }
      });


}
exports.getOrders = (req,res)=>{
      Order.find({})
      .exec((error, orders)=>{
            if(error) return res.status(400).json({ error});
            if(orders){
                  return res.status(201).json({orders});
            }


      });
}
