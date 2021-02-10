const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    link: { type: String },
    description: { type: String, required: true},
    name: { type: String, required: true},
    imageLink: { type: String, required: true},
    when: { type: String, required: true },
    where: { type: String }
  });
  
const Event = mongoose.model("Event", eventSchema);

router.route("/").get((req, res) => {
    Event.find()
      .then((event) => res.json(event))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add").post((req, res) => {
    const { name, link, description, imageLink, when, where } = req.body;
  
    const addEvent = new Event({
        name, 
        link, 
        description, 
        imageLink, 
        when, 
        where
    });
    addEvent
      .save()
      .then(() => res.json(`Your event is now online!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json("Event deleted."))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = {
    router,
    Event
};