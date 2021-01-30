const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: { type: String, required: true, default: "order_id" },
    shops: {type: Array, required: true},
    total: {type: Number, required: true}  
  });
  
const Order = mongoose.model("Order", orderSchema);

router.route("/").get((req, res) => {
    Order.find()
      .then((orders) => res.json(orders))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = {
    router,
    Order
  };