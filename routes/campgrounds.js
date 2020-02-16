var express = require("express");
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware/index.js")


// INDEX - show all campgrounds
router.get('/', function(req, res) {
	// Get all campgrounds from db
	Campground.find({}, function(err, allcampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index.ejs', {campgrounds: allcampgrounds});
		}
	});
});

// Create - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
	// get data from and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = { name: name, price: price, image: image, description: desc, author: author};
	// Create a new campgrounds and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			// rediredt back to campgrounds page
			console.log(newlyCreated);
			res.redirect('/campgrounds');
		}
	});
});

// NEW - show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new.ejs');
});

// SHOW - show more info about one campground
router.get('/:id', function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			// render show template with that campground
			res.render('campgrounds/show.ejs', { campground: foundCampground });
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground})	
	})
})

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	// redirect somewhere (show page)
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router