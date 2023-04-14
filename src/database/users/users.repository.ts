import { default as IUsersRepository } from './users.protocol'
import IUsers from '../../models/users/users-interface.models'
import UsersSchema from '../../models/users/users-schema.models'
import DatabasePrototype from '../database.prototype'

export default class UsersRepository extends DatabasePrototype<IUsers> implements IUsersRepository {
  constructor() {
    super(UsersSchema)
  }
}
