const express = require("express");
const router = express.Router();
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// SECRET_KEY permet de stocker des données de façon sûre, secret est notre valeur
process.env.SECRET_KEY = "secret";

/* cette route permet à un utilisateur de créer un compte */
router.post("/register", (req, res) => {
    db.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {
            if (!client) {
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                db.client.create(req.body)
                    .then(itemclient => {
                        /* res.setHeader('Content-Type', 'text/html'); */
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            /* host: 'smtp.gmail.com',
                            port: '587', */
                            service: "gmail",
                            auth: {
                                user: "eltest2node@gmail.com",
                                pass: "Eltest2nodemailer"
                            },
                            /* secureConnection: 'false',
                            tls: {
                                ciphers: 'SSLv3',
                                rejectUnauthorized: false
                            } */

                        });
                        var mailOptions = {
                            from: "eltest2node@gmail.com",
                            to: itemclient.email,
                            subject: "Confirmation d'inscription Cop X",
                            html: "<a href=http://localhost:8080/validemail/" + itemclient.email + ">Confirmer votre mail</a>"
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                                return res.json(error);

                            } else {
                                console.log("email sent" + info.response);
                                return res.status(200).json({
                                    message: "Vous devez valider votre mail",
                                    email: itemclient.email,
                                    email_sent: info.response
                                })
                            }
                        });

                    })
                    .catch(err => {
                        res.json(err)
                    })


            } else {
                res.json("cette adresse email est déjà utilisée")
            }
        })
        .catch(err => {
            res.json(err)
        })
});


/* router.post("/register", (req, res) => {
    // On vas verifier a partir de sont email
    db.client.findOne({
            where: {
                email: req.body.email
            }
        })
        // Ensuite tu me retourne client
        .then(client => {
            if (!client) {
                // Le salt 10 , un script de 10 caracteres au debut 
                // du cryptage puis de 45 autre caracteres voir plus.
                //  la je lui demande de me hacher mon mdp en le fesant etape par etape
                const hash = bcrypt.hashSync(req.body.password, 10);
                // Je réaffecte le resultat précédent dans req.body.password avant qu'il soit envoyé dans la database
                req.body.password = hash;
                db.client.create(req.body)
                    .then(client => {

                        transporter.sendMail({

                                to: req.body.email,
                                from: 'eltestnode@gmail.com',
                                subject: "Confirmation d'inscription Cop X",
                                html: `
                            <div  style="height:500px; width: 100%; background-image: url(https://www.cjoint.com/doc/20_09/JInrmwR8Uvx_cqNgx7LQoc.jpg); 
                            background-size: cover; background-position: center; background-repeat: no-repeat;">
                            <div>
  
                            <br> <br>
                                <div>
                                    <h1 style=" font-family: 'Times New Roman'; font-weight: bold; text-align: center;font-size: 26px; color:#ff4949;">  
                                    Bienvenue Sur Notre Site, Sneakers Watch  </h1>
                                </div>
                            </div>
                           
                                 <br>
                                    <br>
                                    <h3 style="color:#DCDCDC; text-align:center; font-size: 14px; font-weight: bold;" >
                                    Vous avez reçu ce courriel parce que vous vous  êtes récemment inscrit à nos site Sneakers Watch , veuillez trouvez ci-dessous votre identifiant
                                    </h3>
                                    <br>
                                    <br>
                                    <p style=" text-align: center;" >
                                    <span style="color:#ff4949;">
                                    - Identifiant </span>: ${req.body.email} 
                                    </p> 
                                    <br> 
                                    <h3 style="color:#DCDCDC; text-align:center; font-size: 14px; font-weight: bold;" >
                                    Merci et à très bientôt    <br>   <br>   <br> 
                                    <img src="https://www.cjoint.com/doc/20_09/JInpYq3gpvx_logo-sneakers-watch.png" width="100"; ></h3>
                            </div>`
                            })
                            // je cree la signature de mon token en lui donnant mon secret_key=RS9
                        let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        // Je recupere le token
                        
                        il envoie la reponse en json
                        
                        res.json({
                            token: token
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "Le client existe déjà"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
}); */


/* cette route permet à l'utilisateur de recevoir un mail avec un lien pour changer son mdp oublié */
router.post("/forgetpassword", (req, res) => {
    var randtoken = require('rand-token');
    var token = randtoken.generate(16);
    db.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {
            if (client) {
                client.update({
                        forget: token
                    }).then(item => {
                        var nodemailer = require("nodemailer");

                        var transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "eltestnode@gmail.com",
                                pass: "eltestnodemailer"
                            },
                        });

                        var mailOptions = {
                            from: "eltestnode@gmail.com",
                            to: item.email,
                            subject: "Sending Email using Node.js",
                            html: "<a href=http://localhost:8080/client/pwd/" + item.forget + ">Mettre à jour le mot de passe</a>"
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                res.json(error);
                                console.log(error);
                            } else {
                                console.log("email sent" + info.response);
                                res.json("email sent" + info.response);
                            }
                        });
                    })
                    .catch(err => {
                        res.json(err)
                    })
            } else {
                res.status(404).json("utilisateur non trouvé");
            }
        })
        .catch(err => {
            res.json(err)
        })
});


/* cette route permet à l'utilisateur de pouvoir modifier son mdp */
router.get("/updatepassword", (req, res) => {

    db.client.findOne({
            where: {
                forget: req.body.forget
            }
        })
        .then(client => {
            if (client) {

                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                client.update({
                        password: req.body.password,
                        forget: null,

                    })
                    .then(() => {
                        res.json({
                            message: "Votre mot de passe est mis à jour"
                        })
                    })
                    .catch(err => {
                        res.json(err);
                    })
            } else {
                res.json("lien non valide")
            }
        })
        .catch(err => {
            res.json(err);
        })
});



/* cette route permet à l'utilisateur de pouvoir valider son mail une fois le compte crée */
router.post("/validemail", (req, res) => {

    db.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {
            if (client) {
                /* si tu trouve l'utilisateur tu met son status en true si il est different de 1*/
                if (client.status !== 1) {

                    client.update({
                            status: 1
                        })
                        .then((itemclient) => {
                            res.json({
                                message: "Votre mail est validé"
                            })
                        })
                        .catch(err => {
                            res.json(err);
                        })
                } else {
                    res.json("Votre mail est déjà validé")
                }
            } else {
                res.status(404).json("Utilisateur non trouvé !!!")
            }
        })
        .catch(err => {
            res.json(err);
        })
});

/* cette route permet à l'utilisateur de ce connecter avec ses identifiants */
router.post("/login", (req, res) => {
    db.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {

            if (client.status === true) {

                if (bcrypt.compareSync(req.body.password, client.password)) {
                    let clientdata = {
                        id: client.id,
                        image: client.image,
                        nom: client.nom,
                        date: client.date,
                        sexe: client.sexe,
                        email: client.email,
                        pointure: client.pointure,
                        adresse: client.adresse,
                        ville: client.ville,
                        cp: client.cp,
                        pays: client.pays,
                        tel: client.tel,
                        information_paiement: client.information_paiement,
                    };
                    let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
                        expiresIn: 1800,
                        /* 30min */
                    })
                    res.status(200).json({
                        token: token
                    })
                } else {
                    res.json("error mail or error password")
                }
            } else {
                res.json({
                    message: "Vous devez valider votre adresse mail"
                })
            }
        })
        .catch(err => {
            res.json(err);
        })
});

/* cette route permet de reccupérer les info du profil */
router.get("/profil/:id", (req, res) => {
    db.client.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(client => {
            if (client) {
                let token = jwt.sign(client.dataValues,
                    process.env.SECRET_KEY, {
                        expiresIn: 1800, // 30min

                    });
                res.status(200).json({
                    token: token
                })
            } else {
                res.json("error le client n'est pas dans la base !!!")
            }
        })
        .catch(err => {
            res.json(err)
        })
});


/* cette route permet de mettre le profil à jour */
router.put("/update/:id", (req, res) => {
    db.client.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(client => {
            if (client) {
                /* ce commentaire permet de ne plus demander le mdp pour mettre à jour */
                /* password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password; */
                client.update(req.body)
                    .then(clientitem => {
                        console.log(clientitem);
                        db.client.findOne({
                                where: {
                                    id: clientitem.id
                                }
                            })
                            .then(client => {
                                let token = jwt.sign(client.dataValues,
                                    process.env.SECRET_KEY, {
                                        expiresIn: 1800, //s
                                    });
                                res.status(200).json({
                                    token: token
                                })
                            })
                            .catch(err => {
                                res.status(402).send(err + 'bad request')
                            })
                    })
                    .catch(err => {
                        res.status(402).send("impossible de metter à jour le client" + err);
                    })
            } else {
                res.json("client n'est pas dans la base ")
            }
        })
        .catch(err => {
            res.json(err);
        })
});

/* cette route permet de mettre le mdp a jour */
router.get("/updatepass/:id", (req, res) => {
    db.client.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(client => {
            if (client) {
                /* cette ligne permet de demander le mdp avant de mettre à jour */
                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                client.update(req.body)
                    .then(clientitem => {
                        console.log(clientitem);
                        db.client.findOne({
                                where: {
                                    id: clientitem.id,
                                    forget: req.body.forget,
                                }
                            })
                            .then(client => {
                                let token = jwt.sign(client.dataValues,
                                    process.env.SECRET_KEY, {
                                        expiresIn: 1800, //s
                                    });
                                res.status(200).json({
                                    token: token
                                })
                            })
                            .catch(err => {
                                res.status(402).send(err + 'bad request')
                            })
                    })
                    .catch(err => {
                        res.status(402).send("impossible de metter à jour le client" + err);
                    })
            } else {
                res.json("client n'est pas dans la base ")
            }
        })
        .catch(err => {
            res.json(err);
        })
});



module.exports = router;