const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const homeSchema = new Schema({
    featuredWines: { type: Array, required: true}
  });
  
const Home = mongoose.model("Home", homeSchema);

router.route("/").get((req, res) => {
    Home.findOne()
      .then((home) => res.json(home))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/featured-wines").post((req, res) => {
    const { featuredWines } = req.body;

    Home.findOne((err, homeFound) => {
      if (err) return console.log(err.data);

      homeFound.featuredWines = featuredWines
  
      homeFound
        .save()
        .then(() => res.json(`Home settings updated!`))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    });
});

module.exports = {
    router,
    Home
};