const UserModel = require('@/models/user');
const RoleModel = require('@/models/role');

exports.getOwnInfo = async (userID) => {
	const user = await UserModel.findByPk(userID, {
		attributes: ['id'],
		include: [
			{model: RoleModel, attributes: ['name']}
		]
	});
	return user;
};

exports.getById = async (userID) => {
	const user = await UserModel.findByPk(userID, {
		include: [
			{model: RoleModel}
		],
	});
	return user;
};

exports.getByEmail = async (email) => {
	const user = await UserModel.findOne({
		where: {
			email: email,
		},
	});
	return user;
};

exports.getUnverified = async () => {
	const users = await UserModel.findAll({
		attributes: ['id', 'email', 'verified', 'roleId'],
		where: {
			verified: false,
		}
	});
	return users;
};

exports.verify = async (userID) => {
	const user = await UserModel.findByPk(userID);
	user.verified = true;
	await user.save();
	return true;
};

exports.create = async (user) => {
	const newUser = await UserModel.create(user, {
		fields: ['email', 'hash', 'roleId', 'verified'],
	});
	return newUser;
};
