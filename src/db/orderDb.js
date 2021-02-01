const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: { type: String, required: true },
    userId: {type: String},
    userInformation: { type: Object, required: true },
    shops: {type: Array, required: true},
    total: {type: Number, required: true},
    status: {type: String, required: true, default: 'placed'},
  });
  
const Order = mongoose.model("Order", orderSchema);

router.route("/").get((req, res) => {
    Order.find()
      .then((orders) => res.json(orders))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/delete-order/:orderId").delete((req, res) => {
  Order.findByIdAndDelete(req.params.orderId)
    .then(() => res.json("Bye bye. :("))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add").post((req, res) => {
  const { orderId, userId, userInformation, shops, total, status } = req.body;

  if (typeof userInformation === 'object') {
    const addOrder = new Order({
      orderId,
      userId,
      userInformation,
      shops,
      total,
      status
    });
    addOrder
      .save()
      .then(() => res.json(`Order remembered!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  } else {
      res.json(`User information missing, order not processed!`)
  }
});

module.exports = {
    router,
    Order
  };