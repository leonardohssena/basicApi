import Schema from '../models/schema'

import moment from 'moment'

export default async (req, res, next) => {
	const { code, email } = req.body

	const model = await Schema
		.findOne({ email, 'forgotPassword.code': code })
		.select('forgotPassword')
		.lean()

	if (!model) {
		return res.status(404).json({})
	}

	const now = moment()

	if (now.isAfter(model.forgotPassword.expiresIn)) {
		return res.status(404).json({})
	}

	res.status(200).json({})

	next()
}
