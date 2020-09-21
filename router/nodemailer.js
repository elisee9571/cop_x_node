const express = require("express");

const router = express.Router();

/* cette route permet de recevoir toute sorte de mail */
router.post("/sendmail", (req, res) => {
    var nodemailer = require("nodemailer");

    /*A travers ce mail */
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "eltest2node@gmail.com",
            pass: "Eltest2nodemailer",
        }
    });
    var mailOptions = {
        from: "eltest2node@gmail.com",
        to: req.body.email,
        subject: req.body.obj,
        text: req.body.text
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json(error);
            console.log(error);
        } else {
            console.log("email sent" + info.response);
            res.json("email sent" + info.response);
        }
    });

});

module.exports = router;