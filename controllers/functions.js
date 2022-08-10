const db = require('../models')


module.exports = {

//Esta é uma função que irá gerar automaticamente um ID de aluno para um usuário aluno
//Id gerado é baseado no nome e sobrenome. Se alguém com o mesmo nome de usuário existir no banco de dados, ele será incrementado em 1.
//parâmetros de nome e sobrenome são strings
 studentIdGenerator: function(firstname, lastname) {
    const first = firstname.toLowerCase()
    const last = lastname.toLowerCase()

    const stepOne = first.slice(0,1) + last.slice(0,6);

   return db.RegisterModel.find({lastName: lastname, type: 'Student'})
        .then(resp => {
            const stepTwo = resp.length
            const ID = stepOne + stepTwo
            console.log(ID);
            return ID
        })
        .catch(err => console.log(err))
},

staffIDGenerator: function(firstname, lastname, discipline) {
    const first = firstname.toLowerCase()
    const last = lastname.toLowerCase()
    const disc = discipline.toLowerCase()

    const stepOne = first.slice(0,1) + last.slice(0,6).trim() + disc.slice(0,4).trim();

   return db.RegisterModel.find({lastName: lastname, type: 'Teacher'})
        .then(resp => {
            const stepTwo = resp.length
            const ID = stepOne + stepTwo
            console.log(ID);
            return ID
        })
        .catch(err => console.log(err))
},

urlHttpToHttps: function(url) {
    const slicedURL = url.slice(4, url.length)
    const secureURL = 'https' + slicedURL

    return secureURL
}

}
