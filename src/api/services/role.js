const RoleRepo = require('../repositories/role');

exports.getByName = (name) => {
	const role = RoleRepo.getByName(name);
	return role;
};
