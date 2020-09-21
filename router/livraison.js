const express = require("express");
const router = express.Router();
const db = require("../database/db");


/* cette route post nous permet de créer un produit avec postman */
router.post("/ajouter", (req, res) => {
    console.log(req.body);
    var prix = req.body.prix;
    var description = req.body.description;


    db.livraison.findOne({
            where: {
                nom: req.body.nom
            }
        })
        .then(livraison => {
            if (!livraison) {
                db.livraison.create(req.body)
                    .then(itemlivraison => {
                        db.livraison.create({
                                prix: prix,
                                livraisonId: itemlivraison.id
                            })
                            .then(() => {
                                db.livraison.create({
                                        description: description,
                                        livraisonId: itemlivraison.id
                                    })
                                    .then(() => {
                                        db.livraison.findOne({
                                                where: {
                                                    id: itemlivraison.id
                                                },

                                            })
                                            .then(livraison => {
                                                res.status(200).json({
                                                    livraison: livraison
                                                })
                                            })
                                            .catch(err => {
                                                res.status(502).json(err);
                                            })

                                    })
                                    .catch(err => {
                                        res.status(502).json(err);
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
                res.json("livraison déja bas la base");
            }
        })
        .catch(err => {
            res.status(502).json(err);
        })
});


module.exports = router;