document.addEventListener("DOMContentLoaded", function () {
    var createUser = document.getElementById("create-user");
    var getButton = document.getElementById("get-button");
    //READ
    getButton.addEventListener("click", function () {
        axios.get("/users", {}).then(function (value) {
            var data = new FormData(createUser);
            var a = value.data;
            var tBody = document.getElementById('tBody');
            tBody.innerHTML = "";
            a.forEach(function (a) {
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.innerText = a.vorname;
                var td1 = document.createElement('td');
                td1.innerText = a.nachname;
                var td2 = document.createElement('td');
                td2.innerText = a.email;
                var td3 = document.createElement('td');
                var btn1 = document.createElement('button');
                var btn2 = document.createElement('button');
                btn1.innerText = "UPDATE";
                btn2.innerText = "DELETE";
                btn2.onclick = function () { myFunction(td2.innerText); }; /*delete Funktion*/
                btn1.onclick = function () { myFunction1(td.innerText, td1.innerText, td2.innerText); }; /*update funktion*/
                tBody.appendChild(tr);
                tr.appendChild(td);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                td3.appendChild(btn1);
                td3.appendChild(btn2);
            });
        }).catch(function (reason) {
        });
    });
    //CREATE
    createUser.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(createUser);
        axios.post("/users", {
            "vorname": data.get("vorname"),
            "nachname": data.get("nachname"),
            "email": data.get("email"),
            "password": data.get("password")
        }).then(function (value) {
            document.getElementById("create-user").reset();
            document.getElementById("get-button").click();
        }).catch(function (reason) {
            alert("Sie haben entweder nicht alle Felder ausgefüllt oder sie haben schon eine vergegebene Email eingetragen ");
        });
    });
    //DELETE
    function myFunction(id) {
        axios.delete("/users/" + id, {}).then(function (value) {
            document.getElementById("get-button").click();
        });
    }
    //UPDATE
    function myFunction1(vorname, nachname, email) {
        document.body.style.visibility = "hidden";
        event.preventDefault();
        var nform = document.createElement("form");
        nform.setAttribute("id", "newform");
        var ninput = document.createElement("input");
        ninput.value = vorname;
        var n1input = document.createElement("input");
        n1input.value = nachname;
        var n2input = document.createElement("input");
        n2input.value = email;
        var n3input = document.createElement("input"); //alte password
        n3input.type = "password";
        n3input.placeholder = "Alte password";
        var n4input = document.createElement("input"); //neu password
        n4input.type = "password";
        n4input.placeholder = "Neue password";
        var n5input = document.createElement("input"); //neue password
        n5input.type = "password";
        n5input.placeholder = "Neue password";
        var nbtn = document.createElement('button');
        nbtn.innerText = "BESTÄTIGEN";
        document.body.appendChild(nform);
        nform.appendChild(ninput);
        nform.appendChild(n1input);
        nform.appendChild(n2input);
        nform.appendChild(n3input);
        nform.appendChild(n4input);
        nform.appendChild(n5input);
        nform.appendChild(nbtn);
        //Bestätigungs Methode
        nbtn.onclick = function () { myFunction2(ninput.value, n1input.value, n2input.value, n3input.value, n4input.value, n5input.value, nform); };
        n2input.readOnly = true;
        var x = document.getElementById("newform");
        x.style.visibility = "visible";
    }
    function myFunction2(nvorname, nnachname, nemail, apassword, npassword1, npassword2, updateform) {
        event.preventDefault();
        axios.put("/users/" + nemail, {
            "apassword": apassword,
            "npassword1": npassword1,
            "npassword2": npassword2,
            "vorname": nvorname,
            "nachname": nnachname
        }).then(function (value) {
            document.body.style.visibility = "visible";
            document.getElementById("get-button").click();
            updateform.parentNode.removeChild(updateform);
            alert("Update Succesfully");
        }).catch(function (reason) {
            alert("Entweder \n 1. Nicht alle Felder ausgefüllt \n 2. Die neuen Passwörter stimmen nicht überein \n 3. Das alte Passwort ist falsch");
        });
    }
});
