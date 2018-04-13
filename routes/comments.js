var express = require("express");
var router  = express.Router({mergeParams: true});
var Snippet = require("../models/snippet");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, middleware.checkSnippetExistance, function(req, res){
    // find snippet by id
    console.log(req.params.id);
    Snippet.findById(req.params.id, function(err, snippet){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {snippet: snippet});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup snippet using ID
   Snippet.findById(req.params.id, function(err, snippet){
       if(err){
           console.log(err);
           res.redirect("/snippets/");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", err.name + " - Something went wrong.");
               console.log(err);
               res.redirect('/snippets/' + snippet._id + '/comments/new');
           } else {
               comment.dateOfCreation = new Date().toJSON().slice(0,10).replace(/-/g,'/');
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               snippet.comments.push(comment);
               snippet.save();
               console.log(comment);
               req.flash("success", "Successfully added comment")
               res.redirect('/snippets/' + snippet._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, middleware.checkCommentExistance, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {snippet_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.checkCommentExistance, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/snippets/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/snippets/" + req.params.id);
       }
    });
});

module.exports = router;