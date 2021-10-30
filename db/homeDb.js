const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const homeSchema = new Schema({
    featuredWines: { type: Array, required: true },
    descriptionEvents: { type: String, required: true },
    imageLinkEvents: { type: String, required: true },
    descriptionServices: { type: String, required: true },
    imageLinkServices: { type: String, required: true },
    descriptionGeneral: { type: String, required: true},
    maintenanceMode: { type: Boolean }
});
  
const Home = mongoose.model("Home", homeSchema);

router.route("/").post((req, res) => {
    Home.findOne()
      .then((home) => res.json(home))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/check-maintenance").post((req, res) => {
  Home.findOne()
    .then((home) => res.json(home.maintenanceMode))
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

router.route("/general-description").put((req, res) => {
  const { descriptionGeneral } = req.body

  Home.findOne((err, homeFound) => {
    if (err) return console.log(err.data);

    homeFound.descriptionGeneral = descriptionGeneral

    homeFound
      .save()
      .then(() => res.json(`Home settings updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

router.route("/toggle-maintenance-mode").put((req, res) => {
  const { secretKey, setMaintenanceMode } = req.body

  if (secretKey === process.env.MAINTENANCE_MODE_SECRET_KEY) {
    Home.findOne((err, homeFound) => {
      if (err) return console.log(err.data);
  
      homeFound.maintenanceMode = setMaintenanceMode
  
      homeFound
        .save()
        .then(() => res.json(`Home settings updated!`))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    });
  } else {
    return res.status(401).json(`Unauthorized: wrong secret key.`)
  }
});

router.route("/events-description").put((req, res) => {
  const { descriptionEvents, imageLinkEvents } = req.body

  Home.findOne((err, homeFound) => {
    if (err) return console.log(err.data);

    homeFound.descriptionEvents = descriptionEvents
    homeFound.imageLinkEvents = imageLinkEvents

    homeFound
      .save()
      .then(() => res.json(`Home settings updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

router.route("/services-description").put((req, res) => {
  const { descriptionServices, imageLinkServices } = req.body

  Home.findOne((err, homeFound) => {
    if (err) return console.log(err.data);

    homeFound.descriptionServices = descriptionServices
    homeFound.imageLinkServices = imageLinkServices

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