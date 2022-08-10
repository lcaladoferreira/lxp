const db = require("../models");
const fs = require("fs");
const { RegisterModel } = require("../models");
const { register } = require("../client/src/serviceWorker");

module.exports = {
  //O método Find all destina-se a encontrar todas as salas de aula  
  //Pode ser necessário adicionar um componente a isto.
  findAll: function (req, res) {
    console.log("procurando salas de aula...");
    console.log(req.query);

    let query = {};

    if (req.query.select === "all") {
      // obtém todas as classes, independentemente do que eles digitam na entrada
      query = query;
    } else if (req.query.select === "courseTitle") {
      query.courseTitle = { $regex: req.query.input, $options: "i" };
    } else if (req.query.select === "courseDescription") {
      //Esta consulta usa $regex que permite que uma expressão regular seja entregue ao mongoDb.
      //the $options: 'i' é um operador mongoDb que especifica a diferenciação entre maiúsculas e minúsculas. Irá corresponder letras maiúsculas e minúsculas na string de campo que estou pesquisando
      query.courseDescription = { $regex: req.query.input, $options: "i" };
    } else if (req.query.select === "subject") {
      //agora isso apenas faz o mesmo que o All
      query.courseDiscipline = { $regex: req.query.input, $options: "i" };
      query = query;
    }

    console.log(query);
    db.ClassroomModel.find(query)
      .then((dbModel) => {
        console.log(dbModel);
        res.json(dbModel);
      })
      .catch((err) => res.status(422).json(err));
  },

  //Este método destina-se a encontrar uma sala de aula específica por Id. Isso será usado quando quiser abrir uma página de sala de aula específica
  findById: function (req, res) {
    console.log("encontrando salas de aula por id ...");
    db.ClassroomModel.findById(req.params.id)
      .populate({ path: "announcements" })
      // .populate({path:'comments'})
      .exec((error, dbModel) => res.json(dbModel));
  },

  //preenchendo as informações do aluno
  // route: "api/classrooms/populate/:id"
  findByIdandPopulate: function (req, res) {
    console.log("preechendo ...");
    console.log(req.params.id);

    db.ClassroomModel.findById(req.params.id)
      // model: 'RegisterModel', select: "_id"
      // .select("teacherID courseTitle students")
      .populate({
        path: "students",
        select: ["firstName", "lastName", "email", "ID", "grades"],
      })
      // .populate({path: 'students', populate: { path: 'grades', populate: {path: 'assignments'} }})
      .populate({ path: "assignments" })
      .populate({
        path: "announcements",
        populate: {
          path: "comments",
          populate: { path: "author", select: ["-password"] },
        },
      })
      .exec((err, dbModel) => {
        // !err ?
        // CommentModel.populate(dbModel)
        console.log("database model: ", dbModel);
        res.json(dbModel);

        // res.status(422).json(err);
      });
  },

  //Isso será usado para criar uma sala de aula. O objetivo é que apenas um usuário que seja professor possa fazer isso. Precisará de autenticação do usuário
   //Currenlty usando req.body e entenda que pode precisar ser mais manipulado ao atualizar o esquema
  create: function (req, res) {
    console.log(req.body);

    const newClass = {
      courseTitle: req.body.title,
      courseDiscipline: req.body.discipline,
      courseDescription: req.body.description,
      teacherID: req.body.userID,
    };

    db.ClassroomModel.create(newClass)
      .then((dbModel) => {
        res.json(dbModel);
        console.log("curso criado");
      })
      .catch((err) => res.status(422).json(err));
  },

  //Isto atualizará as informações atuais das salas de aula, atribuições, título, descrição, mas não algo que seja uma matriz de ids de objetos
  // Certos aspectos disso precisarão de verificação do usuário porque um professor terá mais capacidade de mudar as coisas na sala de aula
  //Currenlty usando req.body e entenda que pode precisar ser mais manipulado ao atualizar o esquema
  update: function (req, res) {
    db.ClassroomModel.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  //Isso é usado para colocar um aluno em uma sala de aula
   //Rota: "api/classrooms/:id/addStudent"
   //:id é o id da turma, o id do aluno é enviado pelo corpo
  AddStudentToClass: async function (req, res) {
    console.log("adicionando o aluno em turma ...");

    const userID = req.body.id;
    const classroomID = req.params.id;

    if (userID === "") {
      res
        .status(500)
        .json({
          error: 2,
          msg: "O usuário deve criar uma conta para participar de uma turma.",
        });
      throw new Error("O usuário não existe no banco de dados");
    }
    try {
      const findUserRequestingToJoin = await db.RegisterModel.findOne({
        _id: userID,
      });

      const getClassroomJoined = await db.ClassroomModel.findOneAndUpdate(
        { _id: classroomID },
        { $push: { students: findUserRequestingToJoin._id } }
      );

      console.log(getClassroomJoined);
      res.json(getClassroomJoined);
    } catch (err) {
      res.status(500).json({
        error: 1,
        msg: "O usuário não foi adicionado à classe. Por favor, tente novamente mais tarde!",
      });

      throw new Error(`Erro ao adicionar o usuário à classe: ${err}`);
    }
  },

  //Isto irá remover a sala de aula 
  //É necessária a verificação do usuário porque apenas um professor pode remover uma sala de aula
  remove: function (req, res) {
    db.ClassroomModel.findById({ _id: req.params.id })
      .then((dbModel) => dbModel.remove())
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  findImgByClassId: function (req, res) {
    db.ClassroomModel.findById(req.params.id, "image")
      .then((dbModel) => {
        console.log(dbModel);
        res.json(dbModel);
      })
      .catch((err) => res.status(422).json(err));
  },

  //Este código é especificamente para adicionar uma imagem ao cartão da sala de aula. req.file é criado usando o multer npm
   //Se for muito volumoso podemos sempre fazer uma rota específica
   //Se confuso, siga os passos deste link: https://medium.com/@colinrlly/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed
   //Permite que essa imagem seja carregada em uma pasta chamada uploaded. Em seguida, ele é salva no banco de dados mongo quando entregue como um objeto em findOneandUpdat
  updateClassImage: function (req, res) {
    const newData = {
      image: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      },
    };

    db.ClassroomModel.findOneAndUpdate({ _id: req.params.id }, newData)
      .then((dbModel) => {
        console.log("updated");
        //exclui o arquivo da pasta de uploads temporários
        fs.unlinkSync(req.file.path);
        res.json(dbModel);
      })
      .catch((err) => res.status(422).json(err));
  },

  createAnnouncement: function (req, res) {
    console.log(req.body);
    console.log(req.params.id);

    db.AnnouncementModel.create(req.body)
      .then((dbModel) => {
        console.log("announcement created");

        db.ClassroomModel.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { announcements: dbModel._id } }
        )
          .populate({ path: "announcements" })
          .exec((err, updatedClass) => {
            console.log("post update", updatedClass);
            res.json(updatedClass);
          });
      })
      .catch((err) => res.status(422).json(err));
  },

  removeAnnouncement: function (req, res) {
    console.log(req.params.id);
    db.AnnouncementModel.findById({ _id: req.params.id })
      .then((dbModel) => dbModel.remove())
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  findAnnouncementsByClassId: function (req, res) {
    console.log(req.body);
    console.log(req.params.id);
  },

  createComment: function (req, res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.body.body);
    console.log(req.body.announcementID);

    db.CommentModel.create(req.body).then((newComment) => {
      db.AnnouncementModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: newComment._id } }
      ).then((updatedAnnouncement) => {
        console.log(updatedAnnouncement);
        res.json(updatedAnnouncement);
      });
    });
  },

  findAuthorById: function (req, res) {
    console.log("finding user by id");
    console.log(req.body);
    db.AnnouncementModel.find({ comments: { _id: req.body.id } }).then(
      (resp) => {
        console.log("got the response", resp);
      }
    );
  },

  //Esta função irá encontrar todas as aulas em que o usuário é aluno ou professor
  findClassesByUser: function (req, res) {
    console.log(req.params.id);

    db.ClassroomModel.find({
      $or: [
        {
          students: { $elemMatch: { $eq: req.params.id } },
        },
        { teacherID: { $eq: req.params.id } },
      ],
    }).then((dbModel) => {
      console.log(dbModel);
      res.json(dbModel);
    });
  },

  removeComment: function (req, res) {
    console.log(req.params.id);

    db.CommentModel.findById(req.params.id)
      .then((dbModel) => dbModel.remove())
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  createAssignment: function (req, res) {
    console.log(req.body);
    console.log(req.params.id);

    db.AssignmentModel.create(req.body)
      .then((dbModel) => {
        console.log("Assignment created");

        db.ClassroomModel.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { assignments: dbModel._id } }
        )
          .exec((err, updatedClass) => {
            console.log("post update", updatedClass);
            res.json(updatedClass);
          });
      })
      .catch((err) => res.status(422).json(err));
  },

  addGrade: function (req, res) {
    console.log("params: ", req.params.classID, req.params.userID);
    console.log("body: ", req.body);

    db.ClassroomModel.findById(req.params.classID)
      .populate("assignments", "title")
      .then((resp) => {
        const keysArr = Object.keys(req.body);
        keysArr.length = keysArr.length - 1;

        const titleArr = keysArr.filter((value, index) => {
          return index > 3;
        });

        const valuesArr = Object.values(req.body);
        valuesArr.length = valuesArr.length - 1;

        const gradesArr = valuesArr.filter((value, index) => {
          console.log(index);
          return index > 3;
        });

        console.log(titleArr);
        console.log(gradesArr);

        try {
          function saveloop() {
            for (i = 0; i < titleArr.length; i++) {
              let titleItem = titleArr[i];
              let gradeItem = gradesArr[i];
              console.log("título da tarefa", titleItem);
              console.log("ID da Sala de aula ", resp._id);
              console.log("materia ", gradeItem);

              db.RegisterModel.findOneAndUpdate(
                { ID: req.body.ID },
                {
                  $push: {
                    grades: {
                      classId: resp._id,
                      assignment: titleItem,
                      grade: gradeItem,
                    },
                  },
                }
              ).then((updatedUser) => {
                console.log("usuário atualizado: ", updatedUser);
                res.json(updatedUser);
              });
            }
          }
          saveloop();
        } catch (err) {
          console.log("erro ao salvar loop", err);
        }
      });
  },

  getGrades: function (req, res) {
    //precisa de userID como parâmetro,

     // entra no modelo de registro e obtém o array de notas que tem
     // ID da turma, ID da tarefa, nota

     // usa o ID da atribuição para obter o título da atribuição
     // anexa à nota e envia de volta json com array

    db.RegisterModel.findById(req.params.id).then((user) => {
      const userGradesArr = user.grades.map((grade) => {
        const obj = {
          assignmentId: grade.assignment,
          grade: grade.grade,
        };
        return obj;
      });

      console.log(userGradesArr);
    });
  },
};
