const { truncate } = require("fs");
const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

// SCHEMAS //

const shoppingCartSchema = new Schema({
  shopId: {type: String , required: true},
  itemId: {type: String, required: true},
  size: {type: String},
  color: {type: String},
  count: {type: Number}
})

const userSchema = new Schema({
  userName: { type: String, required: true, default: "example@egzamply.com" },
  password: { type: String, required: true, default: "password" },
  fullName: { type: String, required: true, default: "User Name" },
  email: { type: String, required: true },
  phone: { type: String, required: true},
  isOwner: { type: Boolean, required: true, default: false},
  address: { type: String, required: true },
  shoppingCart: [shoppingCartSchema]
});

const User = mongoose.model("User", userSchema);
const CartItem = mongoose.model("CartItem", shoppingCartSchema)

// ROUTES //

router.route("/:userId/cart/").get((req,res) => {
  User.findById(req.params.userId)
    .then(user => res.json(user.shoppingCart))
    .catch(err => res.status(400).json(`Error: ${err}`)) 
})

router.route("/:userId/cart/add-cart-item/:shopId/:itemId").post((req,res) => {
  const { shopId, itemId, userId } = req.params;
  const {count} = req.body

  const addCartItem = new CartItem({
    shopId, itemId, count
  });

  User.findById(userId, (err, userFound) => {
    if (err) return console.log(err);
    userFound.shoppingCart = [...userFound.shoppingCart, addCartItem];

    userFound
      .save()
      .then(() => res.json(`Item added to your cart!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
})

router.route("/:userId/cart/delete-cart-item/:shopId/:itemId").post((req, res) => {
  const { shopId, itemId, userId } = req.params;
  User.findById(userId, (err, userFound) => {
    if (err) return console.log(err);
    userFound.shoppingCart = (userFound.shoppingCart).filter(obj => (obj.itemId !== itemId))

    userFound
      .save()
      .then(() => res.json(`Item removed from your cart, because it is no longer available.`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

router.route("/:userId/cart/clear-cart").get((req, res) => {
  const { userId } = req.params;
  User.findById(userId, (err, userFound) => {
    if (err) return console.log(err);
    userFound.shoppingCart = []

    userFound
      .save()
      .then(() => res.json(`Cart cleared.`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/:userId").get((req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/email/:userEmail").get((req, res) => {
  const email = req.params.userEmail;
  User.findOne({ email: email })
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add-user").post((req, res) => {
  const { userName, password, fullName, email, phone, address } = req.body;

  const addUser = new User({
    userName,
    password,
    fullName,
    email,
    phone,
    address
  });

  addUser
    .save()
    .then(() => res.json(`Welcome to the platform ${userName}!`))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/edit-user/:userId/:find/:replace").put((req, res) => {
  const { userId, find, replace } = req.params;

  const newValue = replace.replace(/_/g, " ");

  User.findById(userId)
    .then((userFound) => {
      userFound[find] = newValue;
      userFound
        .save()
        .then(() => res.json(`User info updated!`))
        .catch((e) => res.status(400).json(`Error: ${e}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/delete-user/:userId").delete((req, res) => {
  User.findByIdAndDelete(req.params.userId)
    .then(() => res.json("Bye bye. :("))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = {
  router,
  User
};
