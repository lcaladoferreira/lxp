const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema(
  {
      title: {
          type: String,
          trim: true,
      },
      description: {
          type: String,
          trim: true
      },
      attachments: {
          type: String,
          trim: true
      }
  },
  {
    toJSON: {
      // inclui quaisquer propriedades virtuais quando os dados são solicitados
      virtuals: true
    }
  }
)

const AssignmentModel = mongoose.model("Assignment", AssignmentSchema);

module.exports = AssignmentModel;