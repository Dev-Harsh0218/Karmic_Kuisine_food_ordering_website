const OrderStore = require("../../models/orderStore");

function orderControl() {
  return {
    store(req, res) {
      //validate request
      const { phno, address } = req.body;
      if (!phno || !address) {
        req.flash("error", "All fields are required..");
        return res.redirect("/cart");
      }
      const order = new OrderStore({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phno,
        address: address,
      });
      order
        .save()
        .then((result) => {
          req.flash("success", "Order placed successfully");
          res.redirect("/");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/cart");
        });
    },
    orders(req, res) {
      res.render("orders/order");
    },
  };
}

module.exports = orderControl;
