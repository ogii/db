//snippet
var mongoose = require("mongoose");

var snippetSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      maxlength: 40,
      minlength: 5
   },
   dateOfCreation: String,
   description: {
      type: String,
      required: true,
      maxlength: 2000
   },
   main: {
      type: String,
      required: true,
      maxlength: 800
   },
   category: { type: String, enum: ['Javascript', 'CSS', 'HTML', 'Other'] },
   viewCount: Number,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Snippet", snippetSchema);