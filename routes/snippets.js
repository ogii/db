var express = require("express");
var router  = express.Router();
var Snippet = require("../models/snippet");
var middleware = require("../middleware");
var beautify = require('js-beautify').js_beautify;


//INDEX - show all snippets
router.get("/", function(req, res){
    // Get all snippets from DB
    Snippet.find({}, function(err, allSnippets){
       if(err){
           console.log(err);
       } else {
          res.render("snippets/index",{snippets:allSnippets});
       }
    });
});

//CREATE - add new snippet to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to snippet array
    var title = req.body.title;
    var dateOfCreation = req.body.dateOfCreation;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newSnippet = {title: title, dateOfCreation: dateOfCreation, description: desc, author:author};
    // Create a new sn and snippete to DB
    Snippet.create(newSnippet, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to snippet page
            console.log(newlyCreated);
            res.redirect("/snippets");
        }
    });
});

//NEW - show form to create new snippet
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("snippets/new"); 
});

// SHOW - shows more info about one snippet
router.get("/:id", function(req, res){
    //find the snippet with provided ID
    Snippet.findById(req.params.id).populate("comments").exec(function(err, foundSnippet){
        if(err){
            console.log(err);
        } else {
            console.log(foundSnippet);
            //render show template with that snippet
            res.render("snippets/show", {snippet: foundSnippet});
        }
    });
});

// EDIT Snippet ROUTE
router.get("/:id/edit", middleware.checkSnippetOwnership, function(req, res){
    Snippet.findById(req.params.id, function(err, foundSnippet){
        res.render("snippets/edit", {snippet: foundSnippet});
    });
});

// UPDATE Snippet ROUTE
router.put("/:id",middleware.checkSnippetOwnership, function(req, res){
    // find and update the correct snippet
    Snippet.findByIdAndUpdate(req.params.id, req.body.snippet, function(err, updatedSnippet){
       if(err){
           res.redirect("/snippets");
       } else {
           //redirect somewhere(show page)
           res.redirect("/snippets/" + req.params.id);
       }
    });
});

// DESTROY Snippet ROUTE
router.delete("/:id",middleware.checkSnippetOwnership, function(req, res){
   Snippet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/snippets");
      } else {
          res.redirect("/snippets");
      }
   });
});


module.exports = router;

