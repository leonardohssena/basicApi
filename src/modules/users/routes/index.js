import { Router } from 'express'

import Functions from '../support/functions'
import { accept } from '../../../middleware'
import {
	autoInject,
	forgotPasswordSendPin,
	forgotPasswordValidatePin,
	forgotPassword,
	updatePassword
} from '../middleware'
import { profile, base } from '../pipeline'

const Routes = Router()

Routes
	.get(
		'/',
		base,
		Functions.get()
	)
	.get(
		'/paginate',
		base,
		Functions.getWithPaginate()
	)
	.get(
		'/details/:id',
		base,
		Functions.getById()
	)
	.get(
		'/profile',
		autoInject,
		profile,
		Functions.getById()
	)
	.post(
		'/',
		accept({
			instance: 'body',
			fields: [ 'name', 'email', 'password' ]
		}),
		Functions.post()
	)
	.patch(
		'/',
		autoInject,
		accept({ instance: 'body', fields: [ 'name', 'email' ] }),
		Functions.patch()
	)
	.patch(
		'/forgot-password/send-pin',
		accept({ instance: 'body', fields: [ 'email' ] }),
		forgotPasswordSendPin,
		Functions.patch()
	)
	.patch(
		'/forgot-password/validate-pin',
		accept({ instance: 'body', fields: [ 'email', 'code' ] }),
		forgotPasswordValidatePin
	)
	.patch(
		'/forgot-password',
		accept({ instance: 'body', fields: [ 'email', 'code', 'password' ] }),
		forgotPassword,
		Functions.patch()
	)
	.patch(
		'/password',
		autoInject,
		accept({ instance: 'body', fields: [ 'currentPassword', 'confirmPassword', 'password' ] }),
		updatePassword,
		Functions.patch()
	)
	.delete(
		'/:id',
		Functions.softDelete()
	)

export default Routes
