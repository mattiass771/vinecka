const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const labelSchema = new Schema({
    name: { type: String, required: true},
    imageLink: { type: String, required: true},
    price: { type: Number, required: true, default: 0 },
  });
  
const Label = mongoose.model("Label", labelSchema);

const apiSecret = process.env.API_SECRET

router.route("/").post((req, res) => {
    const {token} = req.body
    if (token === apiSecret) {
      Label.find()
        .then((label) => res.json(label))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    } else {
      res.status(400).json('Unauthorized...')
    }
});

router.route("/add").post((req, res) => {
    const { name, imageLink, price } = req.body;
    const {token} = req.body
    if (token === apiSecret) {
      const addLabel = new Label({
          name, 
          imageLink,
          price
      });
      addLabel
        .save()
        .then(() => res.json(`Your label is now online!`))
        .catch((err) => res.status(400).json(`Error: ${err}`));
      } else {
        res.status(400).json('Unauthorized...')
      }
});

router.route("/update-label/:labelId").post((req, res) => {
  const { labelId } = req.params
  const { name, imageLink, price } = req.body;
  const {token} = req.body
  if (token === apiSecret) {
    Label.findById(labelId, (err, labelFound) => {
      if (err) return console.log(err.data);
      labelFound.name = name
      labelFound.imageLink = imageLink
      labelFound.price = price
      
      labelFound
        .save()
        .then(() => res.json(`Label updated!`))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    });
  } else {
    res.status(400).json('Unauthorized...')
  }
});

router.route("/delete-label/:id").post((req, res) => {
  const {token} = req.body
  if (token === apiSecret) {
  Label.findByIdAndDelete(req.params.id)
    .then(() => res.json("Label deleted."))
    .catch((err) => res.status(400).json(`Error: ${err}`));
  } else {
    res.status(400).json('Unauthorized...')
  }
});

module.exports = {
    router,
    Label
};