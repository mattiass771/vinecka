const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    link: { type: String, required: true},
    description: { type: String, required: true},
    name: { type: String, required: true},
    imageLink: { type: String, required: true},
    when: { type: Date, default: Date.now },
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

module.exports = {
    router,
    Event
};