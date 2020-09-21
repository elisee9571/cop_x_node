const express = require("express");
const router = express.Router();
const db = require("../database/db");


/* cette route post nous permet de créer un abonnement */
router.post("/new", (req, res) => {
    console.log(req.body);

    db.abonnement.findOne({
            where: {
                nom: req.body.nom
            }
        })
        .then(abonnement => {
            if (!abonnement) {
                db.abonnement.create(req.body)
                    .then((itemabonnement) => {
                        db.abonnement.findOne({
                                where: {
                                    id: itemabonnement.id
                                },
                            })
                            .then(abonnement => {
                                res.status(200).json({
                                    abonnement: abonnement
                                })
                            })
                            .catch(err => {
                                res.status(502).json(err);
                            })
                    })
                    .catch(err => {
                        res.status(502).json(err);
                    })
            } else {
                res.json("abonnement déja dans la base");
            }
        })
        .catch(err => {
            res.status(502).json(err);
        })
});

/* cette route nous permet de connaitre nos abonnement */
router.get("/all", (req, res) => {
    db.abonnement.findAll({

        })
        .then(abonnement => {

            if (abonnement == []) {
                res.status(404).json("pas de liste de abonnements dans la base ")
            } else {

                res.status(200).json({
                    abonnements: abonnement
                })
            }
        })
        .catch(err => {
            res.status(400).json(err)
        })
});



module.exports = router;