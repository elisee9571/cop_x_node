var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var db = require("../database/db");

process.env.SECRET_KEY = 'secret';

router.post("/register", (req, res) => {
    if ((req.body.role != "admin") && (req.body.role = "")) {
        role = "user"
    } else {
        role = "admin"
    }
    db.user.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (!user) {
                password = bcrypt.hashSync(req.body.password, 10);
                db.user.create({
                        email: req.body.email,
                        password: password,
                        role: role
                    })
                    .then(useritem => {
                        var data = {
                            id: useritem.id,
                            role: useritem.role
                        }
                        let token = jwt.sign(data,
                            process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });

                        res.status(200).json({ token: token })
                    })
                    .catch(err => {
                        res.status(401).json({ err })
                    })
            } else {
                res.json("user déja dans la base");
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
});

router.get("/profile/:id", (req, res) => {
    db.user.findOne({
            where: { id: req.params.id }
        })
        .then(user => {
            if (user) {
                let token = jwt.sign(user.dataValues,
                    process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });
                res.status(200).json({ token: token })
            } else {
                res.json("error le user n'a pas dans la base !!")
            }
        })
        .catch(err => {
            res.json(err)
        })
});

router.post("/login", (req, res) => {
    console.log(req.body);
    db.user.findOne({
            where: { email: req.body.email }
        }).then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password,
                        user.password)) {
                    var userdata = {
                        id: user.id,
                        role: user.role,
                        nom: user.nom,
                        prenom: user.prenom
                    }
                    let token = jwt.sign(userdata,
                        process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                    res.status(200).json({ auth: true, token: token })
                } else {
                    res.json({
                        auth: false,
                        message: "error email or password"
                    })
                }
            } else {
                return res.status(404).json('user not found')
            }
        })
        .catch(err => {
            res.json(err)
        })
});


router.put("/update/:id", (req, res) => {
    db.user.findOne({
            where: { id: req.params.id }
        })
        .then(user => {
            if (user) {
                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                user.update(req.body)
                    .then(useritem => {
                        console.log(useritem);
                        db.user.findOne({
                                where: { id: useritem.id }
                            })
                            .then(user => {
                                let token = jwt.sign(user.dataValues,
                                    process.env.SECRET_KEY, {
                                        expiresIn: 1440 //s
                                    });
                                res.status(200).json({ token: token })
                            })
                            .catch(err => {
                                res.status(402).send(err + 'bad request')
                            })
                    })
                    .catch(err => {
                        res.status(402).send("impossible de metter a jour le user" + err);
                    })
            } else {
                res.json("user n'est pas dans la base ")
            }
        })
        .catch(err => {
            res.json(err);
        })
})





module.exports = router;