// allow a logged-in user to see, edit and update their profiles
// allow admins to see everyone


module.exports = function (req, res, next) {

	var sessionUserMatchesId = req.session.User.id === req.param('id');
	var isAdmin = req.session.User.admin;

	if (!(sessionUserMatchesId || isAdmin)) {
		var noRightsError = [{name: 'noRights', message: 'You must be an admmin'}]
		req.session.flash = {
			err: noRightsError
		}

		res.redirect('/session/new')
		return;

	}

	next();

}
