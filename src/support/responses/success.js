export default ({ status, message, data = undefined, res = {} }) => {
	const response = {
		status,
		message,
		data
	}

	res.response = response

	return response
}
