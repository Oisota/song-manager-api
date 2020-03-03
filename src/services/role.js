const RoleModel = require('../models/role');

exports.getByName = async (name) => {
	const role = await RoleModel.findOne({
		where: {
			name: name,
		},
	});
	return role;
};
