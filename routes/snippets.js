var express = require("express");
var router  = express.Router();
var Snippet = require("../models/snippet");
var middleware = require("../middleware");
var User = require("../models/user");
//var utf8 = require('utf8');

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

//Javascript - show all js snippets
router.get("/javascript", function(req, res){
  // Get all snippets from DB
  Snippet.find({}, function(err, allSnippets){
     if(err){
         console.log(err);
     } else {
        res.render("snippets/javascript",{snippets:allSnippets});
     }
  });
});

//CSS - show all js snippets
router.get("/css", function(req, res){
  // Get all snippets from DB
  Snippet.find({}, function(err, allSnippets){
     if(err){
         console.log(err);
     } else {
        res.render("snippets/css",{snippets:allSnippets});
     }
  });
});

//HTML - show all js snippets
router.get("/html", function(req, res){
  // Get all snippets from DB
  Snippet.find({}, function(err, allSnippets){
     if(err){
         console.log(err);
     } else {
        res.render("snippets/html",{snippets:allSnippets});
     }
  });
});

//Other - show all js snippets
router.get("/other", function(req, res){
  // Get all snippets from DB
  Snippet.find({}, function(err, allSnippets){
     if(err){
         console.log(err);
     } else {
        res.render("snippets/other",{snippets:allSnippets});
     }
  });
});

//CREATE - add new snippet to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to snippet array
  var title = req.body.title;
  var dateOfCreation = new Date().toJSON().slice(0,10).replace(/-/g,'/');
  var main = req.body.main;
  var description = req.body.description;
  var category = req.body.category;
  var viewCount = 0;
  var favorite = [];
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var newSnippet = {title: title, dateOfCreation: dateOfCreation, main: main, description: description, category: category, viewCount: viewCount, favorite:favorite, author:author};
  // Create a new sn and snippete to DB
  Snippet.create(newSnippet, function(err, newlyCreated){
      if(err){
         console.log(err);
         req.flash("error", err.name + " Please fill in all of the fields correctly!");
         res.redirect('snippets/new');
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
router.get("/:id", middleware.checkSnippetExistance, function(req, res){
  //find the snippet with provided ID
  Snippet.findById(req.params.id).populate("comments").exec(function(err, foundSnippet){
      if(err){
          console.log(err);
      } else {
        //incremenet viewcount by one
          Snippet.update({_id:req.params.id}, {$inc: {viewCount: 1}}, function(err) {
            if(err) {
              console.log(err);
            }
          })
          res.render("snippets/show", {snippet: foundSnippet});
      }
  });
});

// EDIT Snippet ROUTE
router.get("/:id/edit", middleware.checkSnippetOwnership, middleware.checkSnippetExistance, function(req, res){
  Snippet.findById(req.params.id, function(err, foundSnippet){
      res.render("snippets/edit", {snippet: foundSnippet});
      console.log(foundSnippet);
  });
});

// UPDATE Snippet ROUTE
router.put("/:id",middleware.checkSnippetOwnership,middleware.checkSnippetExistance, function(req, res){
  // find and update the correct snippet
  Snippet.findByIdAndUpdate(req.params.id, req.body.snippet, function(err, updatedSnippet){
     if(err){
         res.redirect("/snippets");
     } else {
         console.log(req.body);
         req.flash("success", "Successfully edited snippet");
         res.redirect("/snippets/" + req.params.id);
     }
  });
});//{ "$push": { "favorites": req.body.snippet } }

router.get("/:id/favorite", function(req, res){
  Snippet.findById(req.params.id, function(err, foundSnippet){
      User.update({_id:req.user._id}, {$push: {"favorite": foundSnippet}}, function(err, updatedUser) {
        if(err){
          console.log(err);
        } else {
          req.flash("success", "Added to favorites");
          res.redirect("/snippets/" + req.params.id);
          console.log('update' + foundSnippet);
        }
      });
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

