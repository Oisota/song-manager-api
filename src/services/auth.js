const bcrypt = require('bcrypt');

const util = require('../util');
const UserService = require('./user');
const RoleService = require('./role');

/*
 * Login a user
 */
exports.login = async (email, password) => {
	const user = UserService.getByEmail(email);
	if (!user) {
		throw new Error('Could not find user');
	}
	const valid_password = await bcrypt.compare(password, user.hash);
	if (valid_password) {
		const token = await util.jwtSign({
			sub: user.id,
			role: user.role,
		});
		return token;
	} else {
		throw new Error('Invalid Password');
	}
};

exports.register = async (email, password) => {
	const hash = await bcrypt.hash(password, 10);
	const role = RoleService.getByName('user');
	const user = {
		email: email,
		hash: hash,
		roleID: role.id,
	};
	const result = UserService.create(user);
	return result;
};

/*
 * Get user account requests
 */
exports.accountRequests = () => {
	const users = UserService.getUnverified();
	return users;
};

exports.verifyUser = (userID) => {
	const result = UserService.verify(userID);
	return result;
};
