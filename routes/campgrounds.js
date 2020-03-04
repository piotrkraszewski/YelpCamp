var express = require("express");
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware/index.js")
var Review = require("../models/review")
var Comment = require("../models/comment");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    var noMatch = null
    var noMatchBtn = null
    var noMatchText = null
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            if(allCampgrounds.length < 1){
                noMatch = "No campgrounds match that query, please try again"
                noMatchBtn = 'btn btn-primary btn-default'
                noMatchText = 'See all campgrounds'
            }
           res.render("campgrounds/index",{
               campgrounds: allCampgrounds, 
               page: 'campgrounds', 
               noMatch: noMatch, 
               noMatchText: noMatchText, 
               noMatchBtn: noMatchBtn});
        }
     });
    } else {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch, noMatchText: noMatchText, noMatchBtn: noMatchBtn});
       }
    });
    }
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

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments likes").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
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
	delete req.body.campground.rating;
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
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router