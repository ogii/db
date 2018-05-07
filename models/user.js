var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    level: String,
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Snippet"
        }
    ],

    snippet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Snippet"
        }

});

UserSchema.plugin(passportLocalMongoose, {
    selectFields: 'username password level favorites snippet'
});

module.exports = mongoose.model("User", UserSchema);