const format = ([ key, { message } ]) => ({ [key]: message })

export default ({ status, message, err = {}, res = {} }) => {
	console.log(err)

	const validators = err.errors || err

	const errors = Object
		.entries(validators)
		.map(format)

	const response = {
		status,
		message,
		errors
	}

	res.response = response

	return response
}
