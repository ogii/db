var Snippet = require("../models/snippet");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkSnippetExistance = function(req, res, next) {
  Snippet.findById(req.params.id, function(err, foundSnippet) {
    if(err) {
      req.flash("error", "This snippet doesn't exist.");
      res.redirect("/snippets");
    } else {
      next();
    }
  });
}

middlewareObj.checkCommentExistance = function(req, res, next) {
  Snippet.findById(req.params.comment_id, function(err, foundSnippet) {
    if(err) {
      req.flash("error", "This Comment doesn't exist.");
      res.redirect("/snippets");
    } else {
      next();
    }
  });
}

middlewareObj.checkSnippetOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Snippet.findById(req.params.id, function(err, foundSnippet){
           if(err){
               req.flash("error", "Snippet not found");
               res.redirect("back");
           }  else {
               // does user own the Snippet?
            if(foundSnippet.author.id.equals(req.user._id) || foundSnippet.author.username.equals('admin')) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

/*middlewareObj.checkIfFavoriteOrNot = function(req, res, next) {
 if(req.isAuthenticated()){
        Snippet.findById(req.params.id, function(err, foundSnippet){
           if(err){
            console.log(err);
               req.flash("error", "Snippet not found");
               res.redirect("back");
           }  else {
               // does user own the Snippet?
            //if(foundSnippet.favorite.contains(req.user._id)) {
             // next();
                //req.flash("error", "This snippet is already favorited!");
                //res.redirect("back");
           //} else {
                next();
            //}
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};
*/

module.exports = middlewareObj;