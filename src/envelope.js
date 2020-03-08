/*
 * Function for wrapping responses in a
 * a standard envelope object
 */
exports.envelope = (data, error = null) => {
	return {data, error};
};
