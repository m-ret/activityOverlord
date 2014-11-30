/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

	'new': function(req, res) {

		res.view('session/new');
	},

	create: function(req, res, next) {

		if(!req.param('email') || !req.param('password')){
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both blanks.'}]

			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/session/new');
			return;
		}

	User.findOneByEmail(req.param('email'), function foundUser (err, user){

		if(err) return next(err);

		if(!user) {
			var noAccountError = [{name: 'noAccount', message: 'The email address: ' + req.param('email') + ' not found'}]

			req.session.flash = {
				err: noAccountError
			}

			res.redirect('/session/new')
			return;
			}

			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid){

				if(err) return next(err);

				if(!valid) {
					var usernamePasswordMismatch = [{name: 'usernamePasswordMismatch', message: 'Invalid usename and password combination'}]

					req.session.flash = {
						err: usernamePasswordMismatch
					}

					res.redirect('/session/new')
					return;
				}
				// log user in
				req.session.authenticated = true;
				req.session.User = user;

				if(req.session.User.admin) {
					res.redirect('/user');
					return;
				}

				// reidrect to their profile page
				res.redirect('/user/show/' + user.id);
			});
		});
	},

	destroy: function(req, res, err) {

		req.session.destroy();

		res.redirect('/session/new');
	}
};
