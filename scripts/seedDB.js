const mongoose = require("mongoose");
const db = require("../models");

// Este arquivo esvazia a coleção Books e insere os livros abaixo
// o Banco de Dados necessita de novas chaves, estas chaves estão invalidas e foram usadas em outro projeto.


mongoose.connect("mongodb://localhost/lxpProject", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const AsssignmentSeed = [
  {
    title: "título de atribuição de sementes",
    body: "corpo de atribuição semeado",
  },
];

const AnnouncementSeed = [
  {
    title: "Título do anúncio semeado",
    body: "corpo de anúncio semeado",
  },
];
db.AssignmentModel.remove({})
  .then(() => db.AssignmentModel.collection.insertMany(AsssignmentSeed))
  .then((data) => {
    console.log(data.result.n + " registros inseridos!");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

db.AnnouncementModel.remove({})
  .then(() => db.AnnouncementModel.collection.insertMany(AnnouncementSeed))
  .then((data) => {
    console.log(data.result.n + " registros inseridos!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
