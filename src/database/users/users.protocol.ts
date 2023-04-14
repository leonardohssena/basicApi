/* eslint-disable @typescript-eslint/no-empty-interface */
import IUsers from '../../models/users/users-interface.models'
import IDatabaseRepository from '../database.protocol'

export default interface IUsersRepository extends IDatabaseRepository<IUsers> {}
