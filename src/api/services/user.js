const UserRepo = require('../repositories/user');

exports.getOwnInfo = (userID) => {
	const user = UserRepo.getOwnInfo(userID);
	return user;
};

exports.getByEmail = (email) => {
	const user = UserRepo.getByEmail(email);
	return user;
};

exports.getUnverified = () => {
	const users = UserRepo.getUnverified();
	return users;
};

exports.verify = (userID) => {
	const result = UserRepo.verify(userID);
	return result;
};

exports.create = (user) => {
	const result = UserRepo.create(user);
	return result;
};
