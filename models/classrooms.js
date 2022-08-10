const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema(
  {
    // seleciona de um array de disciplinas
     // usa filtro
    courseDiscipline: {
      type: String,
      trim: true,
    },
    // cursos dentro da disciplina 
    courseTitle: {
      type: String,
      trim: true,
    },
    courseDescription: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
      trim: true,
      // valida: /^[0-9]{0,1}\z/
    },
    students: [
      {
        // tem [] envolvendo o {} !!!!!!!!!!
        type: Schema.Types.ObjectId,
        ref: 'Register',
      }
    ],
    teacherID: {
      type: Schema.Types.ObjectId,
      ref: 'Register',
      required: true
    },
    image: {
      data: Buffer,
      contentType: String
    },
    assignments: [
      {
      type: Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    }
  ],
    createDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    announcements: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Announcement',
        required: true
      }
    ]
  },

  // Mongoose Virtuals https://mongoosejs.com/docs/tutorials/virtuals.html
  // uma propriedade não armazenada no MongoDB
  // virtuais normalmente usados para propriedades computadas em documentos
  // configurando virtuals para true para passar propriedades para response.json()
  {
    toJSON: {
      virtuals: true
    }
  });

const ClassroomModel = mongoose.model("Classroom", ClassroomSchema);

module.exports = ClassroomModel;