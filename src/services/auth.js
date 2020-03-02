const bcrypt = require('bcrypt');

const util = require('../util');
const UserService = require('./user');
const RoleService = require('./role');

/*
 * Login a user
 */
exports.login = async (email, password) => {
	const user = await UserService.getByEmail(email);
	if (!user) {
		throw new Error('Could not find user');
	}
	const validPassword = await bcrypt.compare(password, user.hash);
	if (validPassword) {
		//TODO add exp date to token, what should expiration timeout be?
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
		roleId: role.id,
	};
	const result = UserService.create(user);
	return result;
};

/*
 * Get user account requests
 */
exports.accountRequests = async () => {
	const users = await UserService.getUnverified();
	return users;
};

/*
 * Verify a user's account, allowing them to login
 */
exports.verify = async (userID) => {
	const result = await UserService.verify(userID);
	return result;
};
