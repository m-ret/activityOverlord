/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	'new': function (req, res) {		
		res.view();		
	},

	create: function (req, res, next) {

		User.create(req.params.all(), function userCreated (err, user){
			if (err) {
				console.log(err);				
				req.session.flash = {
					err: err
				}

				return res.redirect('/user/new/');				
			}

			//after succesfully creating the user
			//redirect to the show action
			
			res.redirect('/user/show/'+user.id);

		});
	},

	// render the profile view e.g /views/show.ejs
	show: function (req, res, next) {

		User.findOne(req.param('id'), function foundUser (err, user) {
			if (err) return next (err);
			if (!user) return next ();
			res.view({
				user: user
			});
		});
	},

	index: function (req, res, next) {

		User.find(function foundUsers (err, users) {
			if (err) return next(err);
			// pass the array down to /views/index.ejs page
			res.view({
				users: users
			});
		});
	},

	edit: function (req, res, next) {

		User.findOne(req.param('id'), function foundUser (err, user) {
			if (err) return next(err);
			if (!user) return next('user does not exist');

			res.view({
				user: user
			});
		});
	},

	update: function (req, res, next) {

		User.update(req.param('id'), req.params.all(), function userUpdate (err) {
			if (err) {
				return res.redirect('/user/edit/' + req.param('id'));
			}

			res.redirect('/user/show/' + req.param('id'));
		});
	},

	destroy: function (req, res, next) {

		User.findOne(req.param('id'), function foundUser (err, user) {
			if (err) return next(err);

			if (!user) return next ('user does not exist');

			User.destroy(req.param('id'), function userDestroyed (err) {
				if (err) return next(err);
			});

			res.redirect('/user');

		});
	}

};

