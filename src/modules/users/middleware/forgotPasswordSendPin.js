import Schema from '../models/schema'

import sendEmail from '../../../services/email'
import { randomHash } from '../../../support/utils'

import moment from 'moment'

export default async (req, res, next) => {
	const { email } = req.body

	const model = await Schema
		.findOne({ email })
		.select('_id')
		.lean()

	if (!model) {
		return res.status(401).json({})
	}

	const code = randomHash({ length: 6 })
	const expiresIn = moment().add(4, 'hours').toDate()

	const forgotPassword = {
		code,
		expiresIn
	}

	req.params.id = model._id
	req.body = { forgotPassword }

	await sendEmail({
		to: email,
		subject: 'Recuperaçao de senha',
		html: `Pincode: ${code}`
	})

	next()
}
