require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
// instancia o express
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3003;
const logger = require("morgan");
const cookieParser = require("cookie-parser");

// segurança de solicitação de origem cruzada (CORS)
// impede requisições para domínios não autorizados
// aceita requisições do cliente
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// usa as rotas
app.use(routes);

// conecta-se ao MongoDB remotamente ou localmente
// quando estiver pronto para produção, vá para userController e defina
// router.post('/login) parâmetro de cookie "secure" para true

//abaixo está o mongoDb uri ao conectar ao heroku via mLab. O Mlab agora está separado do mongoDb e se tornou obsoleto.
//const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds143039.mlab.com:43039/heroku_hkn7jqvr`;
const MONGODB_URI = `mongodb+srv://${process.env.DB_ATLAS_USER}:${process.env.DB_ATLAS_PASSWORD}@${process.env.DB_ATLAS_CLUSTER}.mongodb.net/<dbname>?retryWrites=true&w=majority`;
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI /*|| "mongodb://localhost/ProjectThree"*/, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// chama o servidor
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(
    `🌎 ==> API Server now listening on PORT http://localhost:${PORT}`
  );
});
