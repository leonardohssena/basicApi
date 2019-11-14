import { onSuccess, onError } from '../support/responses'
import { onPatchSuccess, onPatchError } from '../support/responses/messages'

import { updateOptions, unauthorizedModel } from './_utils'

const mountUpdateKey = (field, key) => [`${field}.$.${key}`]

const mountUpdate = (payload, field) => Object
	.entries(payload)
	.reduce((acc, [ key, value ]) => ({ ...acc, [ mountUpdateKey(field, key) ]: value }), {})

export default (Schema, messageConfig) => (field, customMessageConfig) => async (req, res, next) => {
	const responseConfig = customMessageConfig || messageConfig
	try {
		const { params, autoInject = {}, body } = req
		const { id } = params

		const finder = {
			_id: id,
			[ `${field}._id` ]: body._id,
			...autoInject
		}

		const update = {
			$set: mountUpdate(body, field)
		}

		const model = await Schema.findOneAndUpdate(finder, update, updateOptions)

		if (!model) {
			return res.status(401).send(unauthorizedModel)
		}

		const onSuccessMessage = onPatchSuccess(responseConfig)
		const successResponse = onSuccess({ status: 200, message: onSuccessMessage, res })

		res.status(200).send(successResponse)
	} catch (err) {
		const onErrorMessage = onPatchError(responseConfig)
		const errorResponse = onError({ status: 409, message: onErrorMessage, err, res })

		res.status(409).send(errorResponse)
	} finally {
		next()
	}
}
