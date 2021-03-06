var express          = require('express'),
	app              = express(),
	bodyParser       = require('body-parser'),
	mongoose         = require('mongoose'),
	Campground       = require('./models/campground.js'),
	Comment          = require('./models/comment.js'),
	User             = require('./models/user.js'),
	passport         = require('passport'),
	LocalStrategy    = require('passport-local'),
	User             = require('./models/user'),
	methodOverride   = require('method-override'),
	flash            = require('connect-flash'),
	seedDB           = require('./seeds.js')

	commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index"),
	port 			 = process.env.PORT || 3000 || 80;

// requireing routes
var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// seedDB();

mongoose.connect("mongodb+srv://Admin:123@cluster0-xm17x.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// var url =
// 	process.env.DATABASEURL ||
// 	'mongodb+srv://Admin:123@cluster0-xm17x.gcp.mongodb.net/test?retryWrites=true&w=majority' ||
// 	'mongodb://localhost:27017/yelp_camp' ;

// mongoose
// 	.connect(url, {
// 		useNewUrlParser: true,
// 		useCreateIndex: true
// 	})
// 	.then(() => {
// 		console.log('Connected to DB!');
// 	})
// 	.catch((err) => {
// 		console.log('ERROR:', err.message);
// 	});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'lol',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// to musi by� �eby dzia�a�o na heroku i na pc w port 3000
app.listen(port, () => {
	console.log('The server is live on port: ' + port);
});
