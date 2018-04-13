var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: {
      type: String,
      required: true,
      maxlength: 400
   },
    dateOfCreation: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);