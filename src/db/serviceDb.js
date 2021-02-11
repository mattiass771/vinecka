const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    link: { type: String },
    description: { type: String, required: true},
    name: { type: String, required: true},
    imageLink: { type: String, required: true},
  });
  
const Service = mongoose.model("Service", serviceSchema);

router.route("/").get((req, res) => {
    Service.find()
      .then((service) => res.json(service))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add").post((req, res) => {
    const { name, link, description, imageLink } = req.body;
  
    const addService = new Service({
        name, 
        link, 
        description, 
        imageLink, 
    });
    addService
      .save()
      .then(() => res.json(`Your service is now online!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/update-service/:serviceId").post((req, res) => {
  const { serviceId } = req.params
  const { name, link, description, imageLink } = req.body;

  Service.findById(serviceId, (err, serviceFound) => {
    if (err) return console.log(err.data);
    serviceFound.name = name
    serviceFound.link = link
    serviceFound.description = description
    serviceFound.imageLink = imageLink
    
    serviceFound
      .save()
      .then(() => res.json(`Service updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

router.route("/:id").delete((req, res) => {
  Service.findByIdAndDelete(req.params.id)
    .then(() => res.json("Service deleted."))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = {
    router,
    Service
};