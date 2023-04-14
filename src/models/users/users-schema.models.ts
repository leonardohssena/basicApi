import { Schema, model } from 'mongoose'
import IUsers from './users-interface.models'
import UserModel from './users-model.models'
import { existsValidator, uniqueValidator } from '../../utils/validations'

const UserSchema = new Schema(UserModel, {
  timestamps: true,
})

uniqueValidator(UserSchema)
existsValidator(UserSchema)

export default model<IUsers>('User', UserSchema)
