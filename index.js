const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("home");
});



  
app.get("/listaInsc", (req, res) => {
    const sql = "SELECT * FROM inscricoes";

    conn.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao recuperar inscrições");
        }

        const listaInscricoes = data;
        res.render("listaInscricoes", { listaInscricoes });
    });
});


app.get("/inscricao", (req, res) => {
    res.render("inscricao");
});


app.post("/inscricao", (req, res) => {
    const Atracao = req.body.atracao;
    const Data = req.body.data;
    const Horario = req.body.horario;

    const sql = `INSERT INTO inscricoes (atracao, data, horario) VALUES (?, ?, ?)`;
    const values = [Atracao, Data, Horario];
    conn.query(sql, values, function (err) {
        if (err) {
            console.log("Erro:", err);
            return res.status(500).send("Erro ao inserir inscrição");
        }
        res.redirect("/listaInsc");
    });
});



/* aqui é onde seleciona o produto pelo ida na pagina de detalhes */
app.get("/inscricao/:id", (req, res) => {
    const ID = req.params.id;
    const sql = `SELECT * FROM inscricoes WHERE id = ?`; // Usar placeholder para prevenir SQL injection

    conn.query(sql, [ID], function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao recuperar detalhes da inscrição");
        }

        const detalhes = data[0]; // Obtem a primeira (e única) inscrição retornada

        res.render('detalhes', { detalhes });
    });
});


app.get("/detalhes", (req, res) =>[
    res.render("detalhes")
])



app.post('/detalhes/removerInscricao/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM inscricoes WHERE id = ?`; // Usar placeholder para prevenir SQL injection

    conn.query(sql, [id], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao remover inscrição");
        }

        res.redirect('/listaInsc');
    });
});

app.get("/detalhes/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM inscricoes WHERE id = ?`;

    conn.query(sql, [id], function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao recuperar detalhes da inscrição");
        }

        const listaDetalhes = data[0];
        res.render('editdetalhes', { listaDetalhes });
    });
});



app.post("/detalhes/updateInscricao", (req, res) => {
    const { id, atracao, data, horario } = req.body;

    // Certifique-se de que o ID está sendo recebido corretamente
    console.log("ID da inscrição:", id);

    const sql = `UPDATE inscricoes SET atracao = ?, data = ?, horario = ? WHERE id = ?`;
    const values = [atracao, data, horario, id];

    conn.query(sql, values, function (err) {
        if (err) {
            console.log("Erro:", err);
            return res.status(500).send("Erro ao atualizar inscrição");
        }

        res.redirect('/listaInsc');
    });
});

app.get("/about", (req, res) =>{
    res.render("about")
})

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/attractions", (req, res) => {
    res.render("attractions");
});

app.get("/perfil", (req, res) =>{
    res.render("perfil")
});


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "disneyattractions"
});

conn.connect((err) => {
    if (err) {
        console.log("Erro ao conectar ao MySQL:", err);
    } else {
        console.log("Conectado ao MySQL");
        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000");
        });
    }
});


