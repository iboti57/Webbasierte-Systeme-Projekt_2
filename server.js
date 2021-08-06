"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Importieren des Express-Paketes, was vorher über die package.json als Abhängigkeit angegeben wurde
var express = require("express");
//Erzeugen des Express-Objekts als fertigen Server
var router = express();
//Starten des Servers auf Port 8080 (weil der meist frei ist)
router.listen(8080, function () {
    console.log("Server auf http://localhost:8080/ gestartet");
});
var user = /** @class */ (function () {
    function user(vorname, nachname, password, email) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.password = password;
    }
    return user;
}());
var userss = [
    {
        vorname: 'Philip',
        nachname: 'Christian',
        email: 'muller@gmail.com',
        password: '1234'
    },
    {
        vorname: 'Alina',
        nachname: 'Maya',
        email: 'altay@gmail.com',
        password: '0000'
    }
];
var name = new user("eraslan", "ibrahim", "1111", "eraslan@gmail.com");
name.password = "sadas";
var userArray = [name];
userArray.push();
//Die sog. Bodyparser wandeln JSON- (bzw. URLencoded-) Strings in nutzbare Objekte um
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//Aliase für öffentliche Ordner, der eigentliche Pfad / Ordnername wird hinter einer URL versteckt
//Aus der URL localhost:8080/res/images/profil.png wird die Datei ./public/images/profil.png
router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));
//Die Startseite als "/" liefert immer per sendFile eine Webseite (HTML-Datei) zurück
router.get("/", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
});
//CREATE
router.post("/users", function (req, res) {
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    var email = req.body.email;
    var password = req.body.password;
    var cnt = 0;
    //überprüfung ob es sich um die gleiche Email handelt
    userss.forEach(function (product) {
        if (product.email === email) {
            cnt++;
        }
    });
    //überprüfung ob es sich um ausgefüllte Felder handelt
    if (vorname.trim() !== "" && nachname.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
        //überprüfung ob es sich um die gleiche Email handelt
        if (cnt == 0) {
            userss.push({
                vorname: vorname,
                nachname: nachname,
                email: email,
                password: password
            });
        }
        else {
            res.status(404);
            console.log("Email ist schon vergeben");
        }
    }
    else {
        res.status(400);
        console.log("nicht alle Felder ausgefüllt");
    }
    res.send();
});
//READ
router.get("/users", function (req, res) {
    res.status(200);
    res.send(userss);
});
//DELETE
router.delete("/users/:id", function (req, res) {
    var email = String(req.params.id);
    userss.forEach(function (product, index) {
        if (product.email === String(email)) {
            userss.splice(index, 1);
        }
    });
    return res.send();
});
//UPDATE
router.put("/users/:id", function (req, res) {
    var email = String(req.params.id);
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    var apassword = req.body.apassword;
    var npassword1 = req.body.npassword1;
    var npassword2 = req.body.npassword2;
    if (vorname.trim() !== "" && nachname.trim() !== "" && email.trim() !== "") {
        userss.forEach(function (user) {
            if (user.email === String(email)) {
                if (apassword === user.password) {
                    if (npassword1 === npassword2) {
                        user.vorname = vorname;
                        user.nachname = nachname;
                        user.password = npassword1;
                    }
                    else {
                        console.log("neu passworden sind nicht gleich");
                        res.sendStatus(404);
                    }
                }
                else {
                    console.log("alte und neu passworden sind nicht gleich");
                    res.sendStatus(404);
                }
            }
        });
    }
    else {
        console.log("nicht alle Felder ausgefüllt");
        res.sendStatus(404);
    }
    return res.send();
});
