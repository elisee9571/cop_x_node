const express = require("express");
const router = express.Router();
const db = require("../database/db");

const { Op } = require("sequelize"); // declare les opérateurs

/* cette route post nous permet de créer un produit avec postman */
router.post("/new", (req, res) => {
    console.log(req.body);
    var image = req.body.image;
    var taille = req.body.taille;
    var ref = req.body.ref;

    db.produit.findOne({
            where: { nom: req.body.nom }
        })
        .then(produit => {
            if (!produit) {
                db.produit.create(req.body)
                    .then(itemproduit => {
                        db.image.create({
                                image: image,
                                produitId: itemproduit.id
                            })
                            .then(() => {
                                db.taille.create({
                                        taille: taille,
                                        produitId: itemproduit.id
                                    })
                                    .then(() => {
                                        db.taille.create({
                                                ref: ref,
                                                produitId: itemproduit.id
                                            })
                                            .then(() => {
                                                db.produit.findOne({
                                                        where: { id: itemproduit.id },
                                                        include: [{
                                                                model: db.image
                                                            },
                                                            {
                                                                model: db.taille
                                                            },
                                                        ]
                                                    })
                                                    .then(produit => {
                                                        res.status(200).json({ produit: produit })
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
                    })
                    .catch(err => {
                        res.status(502).json(err);
                    })

            } else {
                res.json("produit déja bas la base");
            }
        })
        .catch(err => {
            res.status(502).json(err);
        })
});

/* cette route nous permet de connaitre nos produits */
router.get("/All", (req, res) => {
    db.produit.findAll({
            include: [
                { model: db.image },
                { model: db.taille },
            ]
        })
        .then(produit => {

            if (produit == []) {
                res.status(404).json("pas de liste de produits dans la base ")
            } else {

                res.status(200).json({ produits: produit })
            }
        })
        .catch(err => {
            res.status(400).json(err)
        })
});

/* cette route nous permet de connaitre nos produits par categorie */
router.get("/categorie/:categorie", (req, res) => {
    db.produit.findAll({

            where: { categorie: req.params.categorie },

            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ]
        })
        .then(produit => {

            if (produit == []) {
                res.status(404).json("pas de liste de produits dans la base ")
            } else {

                res.status(200).json({ produits: produit })
            }
        })
        .catch(err => {
            res.status(400).json(err)
        })
});

/* cette route nous permet de définir une limite */
router.get("/limit/:limit", (req, res) => {
    db.produit.findAll({
            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ],
            limit: parseInt(req.params.limit),
        })
        .then(produits => {
            res.status(200).json({ produits: produits })
        })
        .catch(err => {
            res.status(502).json("bad req" + err);
        })
});



/* cette route nous permet de définir un début et une limite */
router.get("/all/:limit/:offset", (req, res) => {
    db.produit
        .findAll({
            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ],
            offset: parseInt(req.params.offset),
            limit: parseInt(req.params.limit),
        })
        .then(produits => {
            res.status(200).json({ produits: produits })
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route nous permet de définir un ordre de produit par rapport à ca date de creation 
dans l'ordre descroissant*/
router.get("/order/:limit", (req, res) => {
    db.produit
        .findAll({
            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ],
            order: [
                ["created_at", "DESC"],
            ],
            limit: parseInt(req.params.limit),
        })
        .then(produits => {
            res.status(200).json({ produits: produits })
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route nous permet de définir un ordre de produit par rapport à ca date de creation 
dans l'ordre croissant*/
router.get("/order1/:limit", (req, res) => {
    db.produit
        .findAll({
            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ],
            order: [
                ["created_at", "ASC"],
            ],
            limit: parseInt(req.params.limit),
        })
        .then(produits => {
            res.status(200).json({ produits: produits })
        })
        .catch((err) => {
            res.json(err);
        });
});


/* cette route nous permet d'ajouter une image à un produit */
router.post("/addimage", (req, res) => {
    db.image.create({
            image: req.body.image,
            ref: req.body.ref,
            produitId: req.body.id,
        })
        .then(() => {
            db.produit.findOne({
                    where: { id: req.body.id },
                    include: [{
                            model: db.image
                        },
                        {
                            model: db.taille
                        },
                    ]
                })
                .then(produit => {
                    res.status(200).json({
                        produit: produit
                    })
                })
                .catch(err => {
                    res.json(err)
                })
        })
});


/* cette route nous permet d'ajouter une taille à un produit */
router.post("/addtaille", (req, res) => {
    db.taille.create({
            taille: req.body.taille,
            ref: req.body.ref,
            produitId: req.body.id,
        })
        .then(() => {
            db.produit.findOne({
                    where: { id: req.body.id },
                    include: [{
                            model: db.image
                        },
                        {
                            model: db.taille
                        },
                    ]
                })
                .then(produit => {
                    res.status(200).json({
                        produit: produit
                    })
                })
                .catch(err => {
                    res.json(err)
                })
        })
});

/* cette route nous permet de rechercher avec le nom un produit spécifique */
router.get("/findBy/:nom", (req, res) => {
    db.produit.findAll({
            where: {
                nom: {
                    [Op.like]: "%" + req.params.nom + "%",
                }
            },
            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ]
        })
        .then(produits => {
            res.status(200).json({ produits: produits })
        })
        .catch(err => {
            res.json(err);
        })
});

router.get("/getById/:id", (req, res) => {
    db.produit
        .findOne({
            where: { id: req.params.id },
            include: [{
                    model: db.image,
                },
                {
                    model: db.taille,
                },
            ],
        })
        .then((produit) => {
            res.status(200).json({ produit: produit });
        })
        .catch((err) => {
            res.json(err);
        });
});





module.exports = router;