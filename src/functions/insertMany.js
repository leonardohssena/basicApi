import { onSuccess, onError } from '../support/responses'
import { onPostSuccess, onPostError } from '../support/responses/messages'

export default (Schema, messageConfig) => (customMessageConfig) => async (req, res, next) => {
	const responseConfig = customMessageConfig || messageConfig
	try {
		const { body, autoInject = {} } = req

		const payloads = body.map(payload => ({ ...payload, ...autoInject }))

		await Schema.create(payloads)

		const onSuccessMessage = onPostSuccess(responseConfig)
		const successResponse = onSuccess({ status: 200, message: onSuccessMessage, res })

		res.status(200).send(successResponse)
	} catch (err) {
		const onErrorMessage = onPostError(responseConfig)
		const errorResponse = onError({ status: 409, message: onErrorMessage, err, res })

		res.status(409).send(errorResponse)
	} finally {
		next()
	}
}
