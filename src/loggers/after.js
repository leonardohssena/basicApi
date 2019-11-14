import Schema from './models/schema'

export default async (req, res) => {
	const { logger } = req
	const { response, statusCode } = res

	await Schema.findByIdAndUpdate(logger, { response, status: statusCode })

	res.end()
}
