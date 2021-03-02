const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

const mailsSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});
  
const Mails = mongoose.model("Mails", mailsSchema);

router.route("/").get((req, res) => {
    Mails.find()
      .then((mails) => res.json(mails))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add").post((req, res) => {
    const { name, email } = req.body;
    const addMails = new Mails({
        name,
        email
    });
    addMails
    .save()
    .then(() => res.json(`Mail remembered!`))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/delete-from-newsletter/").post((req, res) => {
    const { email } = req.body;
    Mails.find((err, mailsFound) => {
      if (err) return console.log(err.data);
      mailsFound = mailsFound.filter(
        (val) => val.email !== email
      );
      mailsFound
        .save()
        .then(() =>
          res.json(`Mail: ${email} was removed from your mails.`)
        );
    });
  });

module.exports = {
    router,
    Mails
};