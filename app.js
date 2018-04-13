var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    flash       = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
	  Snippet  = require("./models/snippet"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    MongoClient = require('mongodb').MongoClient;

//requring routes
var commentRoutes    = require("./routes/comments"),
    snippetRoutes = require("./routes/snippets"),
    indexRoutes      = require("./routes/index");

//Connect to database
var uri = "mongodb://localhost:27017/assion";
mongoose.connect('mongodb://localhost/assion2', function (err) {
   if (err) throw err;
   console.log('Successfully connected');
});

app.use(bodyParser.json({limit: "10mb"}));
app.use(bodyParser.urlencoded({limit: "10mb", extended: true, parameterLimit:10000}));
app.set('view options', { pretty: true });
app.set("view engine", "ejs");
app.use('/static', express.static('public'));
app.use('/script', express.static('node_modules'));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "nasedesu",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//ROUTES
app.use("/", indexRoutes);
app.use("/snippets", snippetRoutes);
app.use("/snippets/:id/comments", commentRoutes);
app.get('*', function(req, res){
  req.flash("error", '404 - Page not found');
  res.redirect('/');
});

app.listen(8000, function () {
	console.log('Code snippet database ver1!');
});