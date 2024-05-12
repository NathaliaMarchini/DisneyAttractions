const express = require("express");
const exphbs = require ("express-handlebars");
const mysql12 = require ("mysql2");
const path = require("path"); // Importando o módulo path

const app = express();


app.set("views", path.join(__dirname, "views"));

app.use(express.static('public'));
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("home")
});


app.post("/login", (req,res) =>{
    res.render("login")
})



const conn = mysql12.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "disneyattractions"
});

conn.connect(function(err) {
    if (err) {
        console.log(err)
    }

    console.log("conectou ao mysql");
    app.listen(3000);
})