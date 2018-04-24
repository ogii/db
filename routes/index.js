var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Snippet = require("../models/snippet");

//root route
router.get("/", function(req, res){
    res.render("index");
});

//show testpage
router.get("/test", function(req, res){
  res.render("test"); 
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Hello " + user.username);
           res.redirect("/snippets"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
  res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/snippets",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/snippets");
});

// show register form
router.get("/search", function(req, res){
   res.render("search"); 
});

//show user profile
router.get("/profile", function(req, res){
    if(req.isAuthenticated()){
          console.log('HEYYYY' + req.user._id);
          Snippet.find({'author.id' : req.user._id},function(err, allSnippets){
            res.render("profile", {snippets:allSnippets});
         });
      } else {
               req.flash("error", "You need to be logged in to do that!");
               res.redirect("/login");
      }
});

//show admin page
router.get("/admin", function(req, res){
  var sessions = req.sessionStore.sessions;
  res.render("admin", {sessions:sessions});
    //if(req.isAuthenticated()){
         // console.log('HEYYYY' + req.user._id);
          //Snippet.find({'author.id' : req.user._id},function(err, allSnippets){
            //res.render("profile", {snippets:allSnippets});
         //});
      //} else {
              // req.flash("error", "You need to be logged in to do that!");
               //res.redirect("/login");
     // }
});

module.exports = router;