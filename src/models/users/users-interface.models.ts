import { Document, ObjectId } from 'mongodb'

const UserType = ['admin', 'user']
const UserStatus = ['active', 'inactive', 'deleted']
const emptyUser: IUsers = {
  _id: new ObjectId(),
  name: '',
  username: '',
  email: '',
  emailVerified: false,
  avatarUrl: '',
  authSubs: [],
}

export { UserType, UserStatus, emptyUser }

export default interface IUsers extends Document {
  _id?: ObjectId
  name: string
  username: string
  email: string
  emailVerified: boolean
  avatarUrl?: string
  authSubs: string[]
  type?: string
  status?: string
  deleted?: boolean
  traktIntegrated?: boolean
  traktLastSync?: Date
  createdAt?: Date
  updatedAt?: Date
}
