import { ObjectId } from 'mongodb'
import { UserStatus, UserType } from './users-interface.models'
import { isEmailValidHelper } from '../../helpers'
import { INVALID, REQUIRED } from '../../utils/validations/messages.utils'

export default {
  _id: ObjectId,
  name: {
    type: String,
    required: [true, REQUIRED],
  },
  username: {
    type: String,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    validate: {
      validator: isEmailValidHelper,
      message: INVALID,
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  avatarUrl: {
    type: String,
  },
  authSubs: {
    type: Array<string>,
    default: [],
  },
  type: {
    type: String,
    enum: UserType,
    default: 'user',
  },
  status: {
    type: String,
    enum: UserStatus,
    default: 'active',
  },
  traktIntegrated: {
    type: Boolean,
  },
  traktLastSync: {
    type: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
}
