var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");

var enableHotReload = require("./hot-reload");

// Configuração do dotenv
require('dotenv').config();

// Importando os controllers
var loginController = require("./controllers/loginController");
var cadastroController = require("./controllers/cadastroController");
var estoqueController = require("./controllers/estoqueController");

var autenticar = require("./middlewares/autenticar");


const app = express();

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Configurações do seu app Express
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

console.log("Views path set to:", path.join(__dirname, "views"));

// Configuração de pasta pública
app.use(express.static(path.join(__dirname, "public")));

// Configuração da sessão
app.use(
  session({
    secret: "chave-super-hiper-mega-blaster-power-segura!",
    resave: false,
    saveUninitialized: false
  })
);

// Habilitar hot-reload
enableHotReload(app);

// Rotas

// Rota para a página inicial
app.get("/", loginController.exibirPaginaLogin);
app.post("/autenticar", loginController.autenticarUsuario);

// Rota para a página de cadastro
app.get("/criar-conta", cadastroController.exibirPaginaCadastro);
app.post("/criar-conta", cadastroController.criarConta);

// Rota para a página de estoque
app.get("/estoque", autenticar.protegerRota, estoqueController.renderizarPaginaEstoque);


// Rota para a página de criar produto
app.get("/criar-produto", autenticar.protegerRota, estoqueController.renderizarPaginaProduto);
app.post("/criar-estoque", estoqueController.criarEstoque);


// Inicie o servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
