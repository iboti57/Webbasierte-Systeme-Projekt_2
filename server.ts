//Importieren des Express-Paketes, was vorher über die package.json als Abhängigkeit angegeben wurde
import * as express from "express";

//Erzeugen des Express-Objekts als fertigen Server
const router: express.Express = express();
//Starten des Servers auf Port 8080 (weil der meist frei ist)
router.listen(8080, () => {
    console.log("Server auf http://localhost:8080/ gestartet");
});

class user{
    vorname:string;
    nachname:string;
    password:string;
    email:string;
    constructor(vorname:string, nachname:string, password:string, email:string) {
        this.vorname=vorname;
        this.nachname=nachname;
        this.email=email;
        this.password=password;
    }
}
let userss=[
    {
        vorname:'Philip',
        nachname:'Christian',
        email:'muller@gmail.com',
        password:'1234'
    },
    {
        vorname:'Alina',
        nachname:'Maya',
        email:'altay@gmail.com',
        password:'0000'
    }
];
let name:user= new user("eraslan","ibrahim","1111","eraslan@gmail.com");
name.password="sadas";

let userArray:user[]=[name];
userArray.push()

//Die sog. Bodyparser wandeln JSON- (bzw. URLencoded-) Strings in nutzbare Objekte um
router.use(express.json());
router.use(express.urlencoded({extended: false}));

//Aliase für öffentliche Ordner, der eigentliche Pfad / Ordnername wird hinter einer URL versteckt
//Aus der URL localhost:8080/res/images/profil.png wird die Datei ./public/images/profil.png
router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));

//Die Startseite als "/" liefert immer per sendFile eine Webseite (HTML-Datei) zurück
router.get("/", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
});

//CREATE
router.post("/users", (req: express.Request, res: express.Response) => {
    const vorname:string=req.body.vorname;
    const nachname:string=req.body.nachname;
    const email:string=req.body.email;
    const password:string=req.body.password;
    let cnt:number=0;
    //überprüfung ob es sich um die gleiche Email handelt
    userss.forEach(function(product) {
        if (product.email === email) {
            cnt++;
        }
    });
    //überprüfung ob es sich um ausgefüllte Felder handelt
    if (vorname.trim() !== "" && nachname.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
        //überprüfung ob es sich um die gleiche Email handelt
        if(cnt==0){
            userss.push({
                vorname:vorname,
                nachname:nachname,
                email:email,
                password:password
            })
        }
        else{
            res.status(404);
            console.log("Email ist schon vergeben");
        }

    }
    else{
        res.status(400);
        console.log("nicht alle Felder ausgefüllt")
    }


    res.send();

});

//READ
router.get("/users", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.send(userss);

});

//DELETE
router.delete("/users/:id", (req: express.Request, res: express.Response) => {
    const email:string=String(req.params.id);

    userss.forEach(function(product, index) {
        if (product.email === String(email)) {
            userss.splice(index, 1);
        }
    });
    return res.send();

});

//UPDATE
router.put("/users/:id", (req: express.Request, res: express.Response) =>{
    const email:string=String(req.params.id);
    const vorname:string=req.body.vorname;
    const nachname:string=req.body.nachname;
    const apassword:string=req.body.apassword;
    const npassword1:string=req.body.npassword1;
    const npassword2:string=req.body.npassword2;

    if (vorname.trim() !== "" && nachname.trim() !== "" && email.trim() !== "") {
        userss.forEach(function(user) {

            if (user.email === String(email)) {
                if(apassword===user.password){
                    if(npassword1===npassword2){
                        user.vorname=vorname;
                        user.nachname=nachname;
                        user.password=npassword1;
                    }
                    else{
                        console.log("neu passworden sind nicht gleich");
                        res.sendStatus(404);
                    }

                }
                else{
                    console.log("alte und neu passworden sind nicht gleich")
                    res.sendStatus(404);
                }
            }

        });
    }
    else{
        console.log("nicht alle Felder ausgefüllt")
        res.sendStatus(404);
    }
    return res.send();

});

