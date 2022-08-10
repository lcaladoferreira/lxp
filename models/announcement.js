const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
  {
      title: {
        type: String,
        trim: true,
        required: "Insira um título de anúncio"
      },
      body: {
        type: String,
        trim: true,
        required: "Insira um título de menssagem"
      },
      attachment: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true
      },
      comments: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
        }
      ],
      createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    },
    {
      toJSON: {
        // inclui quaisquer propriedades virtuais quando os dados são solicitados
        virtuals: true
      }
    })

    // AnnouncementSchema.virtual("commentAuthor").get(function() {
     // // "reduz" array de exercícios para apenas a soma de suas durações
     // return this.comments.populate({path: 'author'})
     // }, 0);

    const AnnouncementModel = mongoose.model("Announcement", AnnouncementSchema);

module.exports = AnnouncementModel;