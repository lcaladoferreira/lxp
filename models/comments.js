const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Registro',
            required: true
        },
        body: {
            type: String,
            trim: true,
            required: "Insira uma mensagem de anúncio"
        },
        createDate: {
            type: Date,
            required: true,
            default: Date.now
        },
    }
)

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;