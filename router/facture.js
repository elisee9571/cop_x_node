const express = require("express");
const router = express.Router();
const db = require("../database/db");

/* cette route post nous permet de créer une facture */
router.post("/new", (req, res) => {
    console.log(req.body);

    db.facture.findOne({
            where: { nom: req.body.nom }
        })
        .then(facture => {
            if (!facture) {
                db.facture.create(req.body)
                    .then(() => {
                        db.facture.findOne({
                                where: { id: itemfacture.id },
                                include: [{
                                    model: db.produit
                                }, ]
                            })
                            .then(facture => {
                                res.status(200).json({ facture: facture })
                            })
                            .catch(err => {
                                res.status(502).json(err);
                            })
                    })
                    .catch(err => {
                        res.status(502).json(err);
                    })
            } else {
                res.json("facture déjà établie");
            }
        })
        .catch(err => {
            res.status(502).json(err);
        })

});



module.exports = router;