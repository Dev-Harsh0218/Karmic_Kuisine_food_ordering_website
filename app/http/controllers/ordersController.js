const OrderStore = require("../../models/orderStore");
const moment=require('moment')

function orderControl() {
  return {
    store(req, res) {
      //validate request
      const { phno, address } = req.body;
      if (!phno || !address) {
        req.flash("error", "All fields are required..");
        return res.redirect("/cart");
      }
      const orderNo = generateUniqueOrderNumber();  
      const order = new OrderStore({
        orderNo: orderNo,
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phno,
        address: address,
      });
      order.save().then((result) => {
          req.flash("success", "Order placed successfully");
          delete req.session.cart;
          //emitting event
          const eventEmitter=req.app.get('eventEmitter')
          eventEmitter.emit('orderPlaced',result)
          res.redirect("/orders");
        }).catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/cart");
        });

    },
    async orders(req, res) {
      const orders= await OrderStore.find({customerId: req.user._id},null,{sort:{'createdAt':-1}})
      const orders_processed= orders.map(order => ({
        id:order._id,
        orderNo: order.orderNo,
        items: Object.keys(order.items).map(itemId => ({
          id: order.items[itemId].item._id,
          name: order.items[itemId].item.i_name,
          price: order.items[itemId].item.i_price,
          qty: order.items[itemId].qty,
        })),
        phone: order.phone,
        address: order.address,
        payType: order.payType,
        status: order.status,
        date: order.createdAt,
      }));
      res.render("orders/order",{orders:orders_processed,moment:moment});
    },

    async singleOrder(req,res){
      const order=await OrderStore.findById(req.params.id)
      let sum=0;
      //authorize user
      if(req.user._id.toString() === order.customerId.toString())
      {
        let parsedItems = Object.values(order.items);
        parsedItems.map((menuItem) => {
        sum = sum + menuItem.item.i_price;
        });
        return res.render('orders/singleOrder',{order:order , moment:moment,amt:sum})
      }
      return res.redirect('/')
    }
  };
}

function generateUniqueOrderNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}
module.exports = orderControl;
