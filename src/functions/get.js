import { onSuccess, onError } from '../support/responses'
import { onGetSuccess, onGetError } from '../support/responses/messages'

import { notFound } from './_utils'

export default (Schema, messageConfig) => (customMessageConfig) => async (req, res, next) => {
	const responseConfig = customMessageConfig || messageConfig
	try {
		const { filters, autoInject = {}, pipeline = [], sort } = req

		const data = await Schema.aggregate([
			{ $match: { ...filters, ...autoInject } },
			...pipeline,
			{ $sort: { ...sort } }
		])

		if (!data.length) {
			return res.status(404).send(notFound)
		}

		const onSuccessMessage = onGetSuccess(responseConfig)
		const successResponse = onSuccess({ status: 200, message: onSuccessMessage, data })

		res.status(200).send(successResponse)
	} catch (err) {
		const onErrorMessage = onGetError(responseConfig)
		const errorResponse = onError({ status: 409, message: onErrorMessage, err, res })

		res.status(409).send(errorResponse)
	} finally {
		next()
	}
}
