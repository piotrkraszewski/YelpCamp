var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Campground = require('./models/campground.js'),
	Comment = require('./models/comment.js'),
	User = require('./models/user.js'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	seedDB = require('./seeds.js');

// requireing routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")


// seedDB(); // seed the data

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash())


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "lol",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser = req.user
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

// to musi by� �eby dzia�a�o ne heroku
app.listen(process.env.PORT, process.env.IP);

// app.listen(3000, function() {
// 	console.log('Server running on port 3000');
// });