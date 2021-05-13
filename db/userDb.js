const mongoose = require("mongoose");
const router = require("express").Router();
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const newComerStamp = process.env.NEWCOMER_STAMP

// SCHEMAS //

const shoppingCartSchema = new Schema({
  shopId: {type: String , required: true},
  itemId: {type: String, required: true},
  size: {type: String},
  color: {type: String},
  count: {type: Number}
})

const userSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true},
  isOwner: { type: Boolean, required: true, default: false},
  address: { type: String, required: true },
  newComerStamp: { type: String, required: true, default: newComerStamp },
  resetSecret: { type: String, index: { expires: 600 }},
  shoppingCart: [shoppingCartSchema]
});

const User = mongoose.model("User", userSchema);
const CartItem = mongoose.model("CartItem", shoppingCartSchema)

// ROUTES //

router.route("/:userId/cart/").post((req,res) => {
  User.findById(req.params.userId)
    .then(user => res.json(user.shoppingCart))
    .catch(err => res.status(400).json(`Error: ${err}`)) 
})

router.route("/password-reset-key-check/").post((req,res) => {
  const {securityKey, newPassword, userId} = req.body
  User.findOne({email: userId})
    .then(async user => {
      if (user.resetSecret && user.resetSecret === securityKey) {
        if (newPassword && typeof newPassword === 'string') {
          const salt = await bcrypt.genSalt(10);
          const passwordH = await bcrypt.hash(newPassword, salt);
          user['password'] = passwordH
          user['resetSecret'] = null
          return user
            .save()
            .then(() => res.status(200).json('success')
            )
            .catch((err) => res.status(400).json(`Error: ${err}`));
        }
      } else if (user.resetSecret && user.resetSecret !== securityKey) {
        return res.status(200).json('invalid')
      } else if (!(user.resetSecret)) {
        return res.status(200).json('expired')
      }
    })
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
  const { itemId, userId } = req.params;
  User.findById(userId, (err, userFound) => {
    if (err) return console.log(err);
    userFound.shoppingCart = (userFound.shoppingCart).filter(obj => (obj.itemId !== itemId))

    userFound
      .save()
      .then(() => res.json(`Item removed from your cart, because it is no longer available.`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

router.route("/:userId/cart/clear-cart").post((req, res) => {
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

router.route("/").post((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/get-user/:userId").post((req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/email/:userEmail").post((req, res) => {
  const email = req.params.userEmail;
  User.findOne({ email: email })
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add-user").post(async (req, res) => {
  const { userName, password, fullName, email, phone, address } = req.body;

  if (userName && typeof userName !== 'string') return res.status(400).json("Invalid datatype provided.")
  if (password && typeof password !== 'string') return res.status(400).json("Invalid datatype provided.")
  if (fullName && typeof fullName !== 'string') return res.status(400).json("Invalid datatype provided.")
  if (email && typeof email !== 'string') return res.status(400).json("Invalid datatype provided.")
  if (phone && typeof phone !== 'string') return res.status(400).json("Invalid datatype provided.")
  if (address && typeof address !== 'string') return res.status(400).json("Invalid datatype provided.")

  if (password && typeof password === 'string') {
    const salt = await bcrypt.genSalt(10);
    const passwordH = await bcrypt.hash(password, salt);
    
    const addUser = new User({
      userName,
      password: passwordH,
      fullName,
      email,
      phone,
      address
    });
  
    addUser
      .save()
      .then(() => res.json(`Welcome to the platform ${userName}!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  } else return res.status(400).json("Invalid request.")
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

router.route("/add-reset-password-key/").post((req, res) => {
  const { newSecret, email } = req.body;

  User.findOne({email})
    .then((userFound) => {
      userFound['resetSecret'] = newSecret;
      userFound
        .save()
        .then(() => res.json(`User secret updated!`))
        .catch((e) => res.status(400).json(`Error: ${e}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/delete-newcomer-discount/:userId").put((req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((userFound) => {
      userFound['newComerStamp'] = "used";
      userFound
        .save()
        .then(() => res.json(`User info updated!`))
        .catch((e) => res.status(400).json(`Error: ${e}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/delete-user/:userId").post((req, res) => {
  User.findByIdAndDelete(req.params.userId)
    .then(() => res.json("Bye bye. :("))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = {
  router,
  User
};
