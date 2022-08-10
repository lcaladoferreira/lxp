const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const RegisterSchema = new Schema(
  {
    type: {
      type: String,
      trim: true,
      required: "selecione a função",
    },
    firstName: {
      type: String,
      trim: true,
      required: "Introduza o nome",
    },
    lastName: {
      type: String,
      trim: true,
      required: "Introduza o sobrenome",
    },
    ID: {
      type: String,
      ref: "User",
    },
    discipline: {
      type: String,
      trim: true,
    },
    
    email: {
      type: String,
      validate: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
    grades: [
      {
        classId: {
          type: Schema.Types.ObjectId,
          ref: "Salas de Aula",
        },
        assignment: {
          type: String,
          trim: true,
        },
        grade: {
          type: String,
          trim: true,
        },
      },
    ],
    // // tokens: [{
    //     token: {
    //         type: Array,
    //         // required: true
    //     },
    // }],
    createDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },

  // Mongoose Virtuals https://mongoosejs.com/docs/tutorials/virtuals.html
   // uma propriedade não armazenada no MongoDB
   // virtuais normalmente usados para propriedades computadas em documentos
   // configurando virtuals para true para passar propriedades para response.json()
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const RegisterModel = mongoose.model("Register", RegisterSchema);

module.exports = RegisterModel;
