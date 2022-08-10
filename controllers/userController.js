// opção de roteamento caseSensitive definida como true
// 5x - https://expressjs.com/en/5x/api.html - documentação alfa
// 4x - https://expressjs.com/en/api.html - disponível v4.16.0 em
const router = require("express").Router({ caseSensitive: true });
const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const IDfunctions = require("./functions");
require("dotenv").config();

// obter todos os usuários
router.get("/", async (req, res) => {
  console.log("nesta rota 13");
  //usuários
  try {
    const results = await db.RegisterModel.find({});
    if (Array.isArray(results) && results.length) {
      res.status(200).send(results);
    } else {
      return res.status(404).send("array de usuários não encontrado");
    }
  } catch (error) {
    res.status(500).send("ocorreu um erro");
    throw error;
  }
});
// check token
router.get("/checkToken", (req, res) => {
  const authorization = req.cookies["authorization"];
  const verified = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET);
  if (verified) {
    res.status(200).send("token de acesso verificado");
  } else res.send("token de acesso NÃO verificado");
});

// obtém cookie e decodifica cabeçalho, carga útil e assinatura via {complete: true}
// em seguida, verifique o cookie usando o segredo do token de acesso ambiental
router.get("/getcookie", (req, res) => {
  const authorization = req.cookies["authorization"];
  if (authorization) {
    const decoded = jwt.decode(authorization, { complete: true });
    const verified = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET);
    if (!verified) return false;
    console.log("token verified: ", verified);
    console.log("token decoded: ", decoded);
    console.log("cookie content: ", authorization);
    return res.json(decoded);
  }
  return res.status(403).send("forbidden");
});

// pegar usuário por id
router.get("/:id", async (req, res) => {
  try {
    await db.RegisterModel.findById({ _id: req.params.id }).then((dbModel) => {
      if (req.body.type === "teacher" || "student") {
        console.log(`usuário tem um token e um tipo`);
        // clonar dbModel via spread
        const userUpdated = { ...dbModel._doc };
        delete userUpdated["password"];
        console.log({ userUpdated });
        res.json({ userUpdated });
      }
    });
  } catch (error) {
    if (error) {
      console.log(error, "por favor registre-se ou faça login");
    }
  }
});

// informações de atualização do usuário
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    console.log(request.body);
    const results = await db.RegisterModel.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        type: req.body.type,
        email: req.body.email,
      },
      { where: { id: request.params.id } }
    );
    if (results) {
      res.status(201).json(results);
    } else {
      res.status(404).send("id não encontrado, bio não atualizada");
    }
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send("ocorreu um erro");
      throw error;
    }
  }
});

// deleta usuário
router.delete("/:id", async (req, res) => {
  try {
    console.log(req.body);
    const trashed = await db.RegisterModel.remove({
      where: { id: req.params.id },
    });
    if (trashed) {
      res.status(203).json(trashed);
    } else {
      res.status(404).send("conta de usuário não deletada");
    }
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send(`ocorreu um erro ${error}`);
      throw error;
    }
  }
});

// registro de usuário
router.post("/register", async (req, res) => {
  let generatedId = "";
  const { type, firstName, lastName, email, password, discipline } = req.body;

  //Isso foi adicionado para verificar o tipo do aluno para direcionar para a função de geração de ID adequada
  if (type === "Student") {
    generatedId = await IDfunctions.studentIdGenerator(firstName, lastName);
  } else {
    generatedId = await IDfunctions.staffIDGenerator(
      firstName,
      lastName,
      discipline
    );
  }
  const encryptedPW = await hashPW(password);
  console.log(generatedId);
  console.log("o código secreto", encryptedPW);
  db.RegisterModel.create({
    type,
    firstName,
    lastName,
    discipline,
    email,
    password: encryptedPW,
    ID: generatedId,
  })
    .then((dbModel) => {
      console.log(dbModel);
      res.json(dbModel);
    })
    .catch((error) => console.log("este é um erro de registro", error));
});

function generateAccessToken(user) {
  // lifespan -> 1440m = 24h = 1d
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1440m",
  });
}

// login do usuário, gera token de acesso, incorpora token de acesso no cookie com
// vida útil idêntica; cabeçalho = autorização
router.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  db.RegisterModel.findOne({ email: username })
    .then((dbModel) => {
      console.log("this is the dbModel");
      const validPW = pwCheck(password, dbModel.password);
      if (validPW) {
        const user = { ...dbModel._doc };
        delete user["password"];
        console.log(user);
        const accessToken = generateAccessToken(user);
        console.log(accessToken);
        res.cookie("authorization", accessToken, {
          expires: new Date(Date.now() + "1440m"),
          secure: false, // usando https set bool to true **IMPORTANTE PARA PRODUÇÃO
          httpOnly: true,
          sameSite: true,
        });
        console.log("este é um cookie data", accessToken);
        res.set("authorization", accessToken);
        res.json({ user });
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => console.log("err here", err));
});

function generateEphemeralToken(user) {
  // tempo de vida -> efêmero de
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 1,
  });
}

// logout do usuário; substitua o cookie definindo o cookie com o mesmo nome
// ao clicar no botão; a vida útil deste cookie é de 1 milissegundo
// que solicitará a API getcookie para history.push("/") em
// um piscar de olhos
router.get("/logout/:id", async (req, res) => {
  try {
    const userLoggingOut = await db.RegisterModel.findById({
      _id: req.params.id,
    });
    if (req.body.type === "teacher" || "student") {
      console.log(`usuário deve ter um token e um tipo`);
      // clonar dbModel via spread
      const user = { ...userLoggingOut._doc };
      delete user["password"];
      const authorization = req.cookies["authorization"];
      if (authorization) {
        const decoded = jwt.decode(authorization, { complete: true });
        const verified = jwt.verify(
          authorization,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (!verified) res.status(403);
        console.log("token verified: ", verified);
        console.log("token decoded: ", decoded);
        console.log("cookie content: ", authorization);
        const ephemeralToken = generateEphemeralToken(user);
        res.cookie("authorization", ephemeralToken, {
          expires: new Date(Date.now() + "1440m"),
          secure: false, // usando https set bool to true **IMPORTANTE PARA PRODUÇÃO
          httpOnly: true,
          sameSite: true,
        });
        console.log("estes são dados efêmeros de token", ephemeralToken);
        // res.removeHeader("authorization", ephemeralToken);
        res.json({ user });
      }
    }
  } catch (error) {
    if (error) {
      console.log(error, "por favor resgistre-se ou faça login");
      res.status(500);
    }
  }
});

function authenticateToken(req, res, next) {
  console.log("requesting cookies", req.cookies);
  const token = req.cookies["authorization"];
   // parte do token do token do portador
   // se authHeader então retorna a parte do token authHeader else indefinido
   // token const = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log("Logging the ERR ", err);
    if (err) return res.sendStatus(403);
    // req.user = user;
    console.log(user);
    next();
  });
}

//cria um middleware usando bcryptjs npm para criptografar ou "hash" a senha do usuário no banco de dados
//por exemplo, abcd1234 foi convertido em $2a$10$iaBPnixg3XKs2Nsl6.hM2.hG.dKFKtc.kmFoPspanv2PU8VEQdIEe via hashPW
async function hashPW(pass) {
  try {
    //salt é semelhante ao conceito de nonce
    const salt = await bcryptjs.genSalt(10);
    const hashedPW = await bcryptjs.hash(pass, salt);
    return hashedPW;
  } catch (err) {
    console.log("Err in hasPW", err);
    return pass;
  }
}

//usando a biblioteca bcrypt para verificar se os PWs com hash no banco de dados correspondem aos PWs fornecidos pelo usuário sem hash
async function pwCheck(password, hash) {
  const isValid = await bcryptjs.compare(password, hash);
  console.log(isValid);
  return isValid;
}

module.exports = router;
