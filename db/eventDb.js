const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    link: { type: String },
    description: { type: String, required: true},
    name: { type: String, required: true},
    imageLink: { type: String, required: true},
    when: { type: String, required: true },
    until: { type: String },
    where: { type: String }
  });
  
const Event = mongoose.model("Event", eventSchema);

const apiSecret = process.env.API_SECRET

router.route("/").post((req, res) => {
    const {token} = req.body
    if (token === apiSecret) {
      Event.find()
        .then((event) => res.json(event))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    } else {
      res.status(400).json('Unauthorized...')
    }
});

router.route("/add").post((req, res) => {
    const { name, link, description, imageLink, when, until, where } = req.body;
    const {token} = req.body
    if (token === apiSecret) {
      const addEvent = new Event({
          name, 
          link, 
          description, 
          imageLink, 
          when, 
          until,
          where
      });
      addEvent
        .save()
        .then(() => res.json(`Your event is now online!`))
        .catch((err) => res.status(400).json(`Error: ${err}`));
      } else {
        res.status(400).json('Unauthorized...')
      }
});

router.route("/update-event/:eventId").post((req, res) => {
  const { eventId } = req.params
  const { name, link, description, imageLink, when, until, where } = req.body;
  const {token} = req.body
  if (token === apiSecret) {
    Event.findById(eventId, (err, eventFound) => {
      if (err) return console.log(err.data);
      eventFound.name = name
      eventFound.link = link
      eventFound.description = description
      eventFound.imageLink = imageLink
      eventFound.when = when
      eventFound.where = where
      eventFound.until = until
      
      eventFound
        .save()
        .then(() => res.json(`Event updated!`))
        .catch((error) => res.status(400).json(`Error: ${error}`));
    });
  } else {
    res.status(400).json('Unauthorized...')
  }
});

router.route("/delete-event/:id").post((req, res) => {
  const {token} = req.body
  if (token === apiSecret) {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json("Event deleted."))
    .catch((err) => res.status(400).json(`Error: ${err}`));
  } else {
    res.status(400).json('Unauthorized...')
  }
});

module.exports = {
    router,
    Event
};