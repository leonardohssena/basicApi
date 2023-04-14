import _ from 'lodash'
import { ObjectId } from 'mongodb'
import IUsersRepository from '../database/users/users.protocol'
import UsersRepository from '../database/users/users.repository'
import { ExceptionHelper } from '../helpers'
import IUsers, { emptyUser } from '../models/users/users-interface.models'
import { httpStatusCodes } from '../utils'

export default class UsersController {
  private usersRepository: IUsersRepository

  constructor() {
    this.usersRepository = new UsersRepository()
    return this
  }

  private joinDBUserWithRequestUser(dbUser: IUsers, requestUser): IUsers {
    dbUser = dbUser || emptyUser
    return {
      _id: dbUser._id,
      name: dbUser.name || requestUser.name,
      username: dbUser.username || requestUser.nickname,
      email: dbUser.email || requestUser.email,
      emailVerified: dbUser.emailVerified || requestUser.email_verified,
      avatarUrl: dbUser.avatarUrl || requestUser.picture,
      authSubs: _.union(dbUser.authSubs, [requestUser.sub]),
    }
  }

  async createUser(requestUser): Promise<IUsers> {
    try {
      const existUser = await this.usersRepository.getOneByAny({
        $or: [{ email: requestUser.email }, { username: requestUser.nickname }],
      })
      const user: IUsers = this.joinDBUserWithRequestUser(existUser, requestUser)

      await this.usersRepository.createOrUpdate(user._id, user)
      return user
    } catch (err) {
      throw new ExceptionHelper('Failed to include user in database', {
        statusCode: httpStatusCodes.CONFLICT,
        data: { stack: err.stack, message: err.message },
      })
    }
  }

  async findById(id: ObjectId): Promise<IUsers | undefined> {
    return this.usersRepository.getOneById(id)
  }

  async findByAuthSub(sub: string): Promise<IUsers | undefined> {
    return this.usersRepository.getOneByAny({ authSubs: sub })
  }
}
