require("dotenv").config();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const db = require("../models");
const userFuncs = require("../controllers/functions");

// o Banco de Dados necessita de novas chaves, estas chaves estão invalidas e foram usadas em outro projeto.



const users = [
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
    type: "Student",
    firstName: "João",
    lastName: "da Silva",
    email: "dasilva@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
    type: "Student",
    firstName: "Maria",
    lastName: "Lídia",
    email: "mlidia@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
    type: "Student",
    firstName: "Fred",
    lastName: "Garcia",
    email: "fgarcia@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8173"),
    type: "Student",
    firstName: "Raquel",
    lastName: "Souza",
    email: "rsouzagmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8174"),
    type: "Student",
    firstName: "Charles",
    lastName: "Miller",
    email: "cmiller@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8175"),
    type: "Teacher",
    firstName: "Leandro",
    lastName: "Ferreira",
    discipline: "Paleontologia",
    email: "lferreira@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8176"),
    type: "Teacher",
    firstName: "Calado",
    lastName: "Ferreira",
    discipline: "Musica",
    email: "cferreira@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
  {
    _id: new mongo.ObjectId("5f29698dda48af2f3c8b8177"),
    type: "Teacher",
    firstName: "Isaac",
    lastName: "Newton",
    discipline: "Ciências",
    email: "inewton@gmail.com",
    password: "password_**********",
    ID: "",
    grades: [],
    creatDate: new Date(),
  },
];

const classes = [
  {
    courseDiscipline: "Ciência",
    courseTitle: "Os fundamentos da física",
    courseDescription:
      "Esta aula cobrirá os fundamentos da física em relação aos sistemas mecânicos, bem como os sistemas elétricos e magnéticos.",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
    ],
    teacherID: new mongo.ObjectId("5f29698dda48af2f3c8b8177"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Ciência",
    courseTitle: "Física Experimental",
    courseDescription:
      "Esta aula irá confundir as linhas da ciência e da ficção científica até que a distinção entre os dois seja limitada apenas pela sua imaginação.",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8174"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8173"),
    ],
    teacherID: new mongo.ObjectId("5f29698dda48af2f3c8b8177"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Escrita",
    courseTitle: "Escrita Criativa",
    courseDescription:
      "Este curso é mais um grupo de feedback estruturado. Aqui aprendemos como pegar uma ideia de história e transformá-la em algo que vale a pena ler.",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8173"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8174"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8176"),
    ],
    teacherID: new mongo.ObjectId("5f29698dda48af2f3c8b8177"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Antropologia",
    courseTitle: "A história dos primeiros humanos",
    courseDescription:
      "Esta aula cobrirá a linha do tempo da evolução dos primeiros homosapiens.",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
    ],
    teacherID: new mongo.ObjectId("5f29698dda48af2f3c8b8177"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Musica",
    courseTitle: "Guitarra para iniciantes",
    courseDescription:
      "Esta aula abordará como comprar uma guitarra para você, como configurar seu equipamento e, finalmente, seus primeiros acordes!",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
      //observe abaixo os ids de objetos do professor convidado Jane Doe e do aluno convidado John Smith que foram adicionados manualmente ao banco de dados primeiro
       //o objetivo é que o professor convidado tenha uma senha com hash e você possa fazer login como professor
      new mongo.ObjectId("5f29870a1d6c0327fcd1639f"),
      new mongo.ObjectId("5f29887ef80ae56488c25d6b"),
    ],
    teacherID: new mongo.ObjectId("5f29698dda48af2f3c8b8177"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Historia",
    courseTitle: "História da Ásia Oriental",
    courseDescription:
      "Esta aula abrangerá a história da China, Japão e Coréia desde os tempos pré-históricos até o presente.",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
      new mongo.ObjectId("5f29870a1d6c0327fcd1639f"),
    ],
    teacherID: new mongo.ObjectId("5f29887ef80ae56488c25d6b"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Historia",
    courseTitle: "China antiga",
    courseDescription:
      "Este curso abrange a história da China desde a Dinastia Shang (c. 1600–1046 aC) até a Dinastia Zhou (c. 1046-256 aC). Preparar-se!",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
      new mongo.ObjectId("5f29870a1d6c0327fcd1639f"),
    ],
    teacherID: new mongo.ObjectId("5f29887ef80ae56488c25d6b"),
    createDate: new Date(),
  },
  {
    courseDiscipline: "Historia",
    courseTitle: "História da Ásia Oriental",
    courseDescription:
      "Esta aula abrangerá a história da China, Japão e Coréia desde os tempos pré-históricos até o presente.",
    students: [
      new mongo.ObjectId("5f29698dda48af2f3c8b8170"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8171"),
      new mongo.ObjectId("5f29698dda48af2f3c8b8172"),
    ],
    teacherID: new mongo.ObjectId("5f29887ef80ae56488c25d6b"),
    createDate: new Date(),
  },
];

const seed = async () => {
  try {
    console.log("[seed] : running...");
    const MONGODB_URI = `mongodb+srv://${process.env.DB_ATLAS_USER}:${process.env.DB_ATLAS_PASSWORD}@${process.env.DB_ATLAS_CLUSTER}.mongodb.net/<dbname>?retryWrites=true&w=majority`;
    console.log(MONGODB_URI);

    const client = await mongoose.connect(
      MONGODB_URI /*|| "mongodb://localhost/ProjectThree"*/,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );

    for (const user of users) {
      let userID = "";

      if (user.type === "Teacher") {
        userID = await userFuncs.staffIDGenerator(
          user.firstName,
          user.lastName,
          user.discipline
        );
      } else {
        userID = await userFuncs.studentIdGenerator(
          user.firstName,
          user.lastName
        );
      }
      user.ID = userID;
      console.log(user);
      console.log(db.registers);
      await db.RegisterModel.collection.insertOne(user);
    }

    for (const classroom of classes) {
      await db.ClassroomModel.collection.insertOne(classroom);
    }

    console.log("[seed] : sucesso ");
  } catch {
    throw new Error("falha ao propagar o banco de dados");
  }
};

seed();
