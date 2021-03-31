const moment = require('moment')
const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: { type: String, required: true },
    userId: {type: String},
    userInformation: { type: Object, required: true },
    shops: {type: Array, required: true},
    total: {type: Number, required: true},
    result: {type: Number},
    status: {type: String, required: true, default: 'vytvorena'},
    createdAt: { type: Date, required: true, default: moment().toISOString() },
    paidAt: {type: Date},
    expireAt: { type: Date, default: Date.now, index: { expires: 900 }},
    paymentId: {type: String},
    paymentResultCode: {type: String},
    deliveryPrice: { type: Number },
    deliveryType: {type: String},
    paymentType: {type: String},
    packageAddresId: {type: String},
    packageCarrierPickupPoint: {type: String}
  });
  
const Order = mongoose.model("Order", orderSchema);

router.route("/").get((req, res) => {
    Order.find()
      .then((orders) => res.json(orders))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/get-by-custom-id/:customOrderId").get((req, res) => {
  const orderId = req.params.customOrderId
  Order.findOne({orderId: orderId})
    .then((order) => res.json(order))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/get-payment-credentials").get((req, res) => {
  const secret = process.env.TRUSTPAY_SECRET
  const accountId = process.env.TRUSTPAY_PID
  res.status(200).json({secret, accountId})
});

router.route("/delete-order/:orderId").delete((req, res) => {
  Order.findByIdAndDelete(req.params.orderId)
    .then(() => res.json("Bye bye. :("))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// REPLACE ATTRIBUTE WITH INPUT FOR SHOP
router.route("/:orderId/update-shipped/").put((req, res) => {
  const { orderId } = req.params;
  const { isShipped } = req.body;

  Order.findById(orderId, (err, orderFound) => {
    if (err) return console.log(err.data);
    orderFound.isShipped = isShipped;

    orderFound
      .save()
      .then(() => res.json(`Status updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

router.route("/:orderId/update-status/").put((req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  Order.findById(orderId, (err, orderFound) => {
    if (err) return console.log(err.data);
    if (orderFound) {
      orderFound.status = status;
      orderFound.expireAt = null;
  
      orderFound
        .save()
        .then(() => res.json(`Status updated!`))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    } else {
      return res.status(404).json(`Order missing, order not processed!`)
    }
  });
});

// TODO
router.route("/:orderId/process-payment/").post((req, res) => {
  const { orderId } = req.params
  const { paymentResultCode, paymentId } = req.body;
  Order.findOne({orderId: orderId}, (err, orderFound) => {
    if (err) return console.log(err.data);
    if (orderFound) {
      orderFound.status = ['4', '3', '0'].includes(paymentResultCode.toString()) ? 'zaplatena' : 
        ['1', '2', '5'].includes(paymentResultCode.toString()) ? 'ocakavana' : 
        ['69'].includes(paymentResultCode.toString()) ? 'prevodom' : 
        ['666'].includes(paymentResultCode.toString()) ? 'dobierka' : 'odmietnuta';
      orderFound.paymentResultCode = paymentResultCode
      orderFound.paymentId = paymentId
      orderFound.expireAt = null;
  
      orderFound
        .save()
        .then(() => res.json(`Payment updated!`))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    } else {
      return res.status(404).json(`Order missing, order not processed!`)
    }
  });
});
//

router.route("/add").post((req, res) => {
  const { orderId, userId, userInformation, result, shops, total, status, deliveryPrice, deliveryType, paymentType, packageAddresId, packageCarrierPickupPoint } = req.body;

  if (typeof userInformation === 'object') {
    const addOrder = new Order({
      orderId,
      userId,
      userInformation,
      shops,
      total,
      status,
      result,
      deliveryPrice,
      deliveryType,
      paymentType,
      packageAddresId,
      packageCarrierPickupPoint
    });
    addOrder
      .save()
      .then(() => res.json(`Order remembered!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  } else {
      res.status(404).json(`User information missing, order not processed!`)
  }
});

router.route("/:id").delete((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json("Order deleted."))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = {
    router,
    Order
  };