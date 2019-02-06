/*
 * Require that a user has a certain role
 */
exports.role = (role) => (req, res, next) => {
	if (req.user.role === role) {
		next();
	} else {
		res.status(403).end();
	}
};
