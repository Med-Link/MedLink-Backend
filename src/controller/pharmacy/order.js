const Order = require('../../models/order');


exports.getOrders = (req,res)=>{
      Order.find({})
      .exec((error, orders)=>{
            if(error) return res.status(400).json({ error});
            if(orders){
                  return res.status(201).json({orders});
            }


      });
}