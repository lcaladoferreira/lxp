// middleware purgatory
const db = require('../models');
const bcryptjs = require('bcryptjs')
const Chance = require('chance');
const chance = new Chance();


function registerInputValidation(request, response, next) {
    const { firstName, lastName, email, password } = request.body;
    //criando array de lista de itens que estão faltando
    const missingFields = [];
    if (!firstName) {
      missingFields.push("Primeiro nome");
    }
    if (!lastName) {
      missingFields.push("Sobrenome");
    }
    if (!email) {
        missingFields.push("e-mail");
    }
    if (!password) {
        missingFields.push("senha");
    }
    if (missingFields.length) {
      response
        //status 400 para solicitação inválida, então junte um ou mais dos campos ausentes acima
        .status(400)
        .send(`Os seguintes campos estão faltando: ${missingFields.join(", ")}`);
    }
    //se nenhum campo estiver faltando, prossiga para o próximo middleware
    else {
      next();
    }
  }

//middleware para impor o uso exclusivo de e-mail via findOne
function uniqueEmail (request, response, next) {
    const {email} = request.body
    db.RegisterModel.findOne({email})
    .then((result) => {
        if (result) {
            response
                .status(400)
                .send(`${email} já esta registrado`)
        }
        else {
            next()
        }
    })
    .catch((error) => {
        console.log(error)
        response.status(500).send('ocorreu um erro')
    })
}

//cria um middleware usando bcryptjs npm para criptografar ou "hash" a senha do usuário no banco de dados
//por exemplo, abcd1234 foi convertido em $2a$10$iaBPnixg3XKs2Nsl6.hM2.hG.dKFKtc.kmFoPspanv2PU8VEQdIEe via hashPW
function hashPW (request, response, next) {
    const { password } = request.body
    //salt é semelhante ao conceito de nonce
    bcryptjs.genSalt(10, function(error, salt) {
        bcryptjs.hash(password, salt, function (error, hash) {
            // Armazene hash em seu banco de dados de senha.
            if (error) {
                response.status(500).send("erro")
            }
            else {
                request.body.password = hash
                next()
            }
        });
    });
}

function loginInputValidation (request, response, next) {
    const { email, password } = request.body;
    //criando array de lista de itens que estão faltando
    const missingFields = [];
    if (!email) {
        missingFields.push("email");
    }
    if (!password) {
        missingFields.push("senha");
    }
    if (missingFields.length) {
      response
        //status 400 para solicitação inválida, então junte um ou mais dos campos ausentes acima
        .status(400)
        .send(`The following fields are missing: ${missingFields.join(", ")}`);
    }
    //se nenhum campo estiver faltando, prossiga para o próximo middleware
    else {
      next();
    }
}

//middleware para buscar qualquer registro de e-mail do usuário; se encontrado, estará localizado no objeto userDocument
function userFind (request, response, next) {
    const { email } = request.body
    db.RegisterModel.findOne({ email: email})
    .then((userDocument) => {
        if (!userDocument) {
            response
                .status(404)
                .send(`${email} não registrado`)
        }
        else {
            request.userDocument = userDocument
            next()
        }
    })
    .catch((error) => {
        console.log(error)
        response
            .status(500)
            .send('Ocorreu um erro')
    })
}

//usando a biblioteca bcrypt para verificar se os PWs com hash no banco de dados correspondem aos PWs fornecidos pelo usuário sem hash
function pwCheck (request, response, next) {
    const hash = request.userDocument.password
    const { password } = request.body
    bcryptjs.compare(password, hash, function(error, passwordCorrect) {
        if (error) {
            console.log(error)
            response
                .status(500)
                .send('Ocorreu um erro')
        }
        else if (passwordCorrect) {
            next()
        } else {
            response
                .status(400)
                .send('Senha incorreta')
        }
    })
}

//acessar o middleware do token usando chance npm para gerar guid (id exclusivo global)
function allowAccess (request, response, next) {
    const accessToken = chance.guid()
    // salva accessToken no banco de dados no documento do usuário
    //pode usar .save() porque o objeto userDocument é uma instância do modelo mongoose
    request.userDocument.accessToken = accessToken
    request.userDocument
        .save()
        .then((result) => {
            if(result) {
                response.send(accessToken)
            } else {
                response
                    .status(400)
                    .send("error")
            }
        })
        .catch((error) => {
            console.log(error)
            response
                .status(500)
                .send("error occurred")
        })
}

module.exports = {
    registerInputValidation,
    uniqueEmail,
    hashPW,
    loginInputValidation,
    userFind,
    pwCheck,
    allowAccess
}