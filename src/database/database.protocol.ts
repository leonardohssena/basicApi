import { ObjectId } from 'mongodb'
import { ProjectionFields } from 'mongoose'

export default interface IDatabaseRepository<T> {
  getOneById(_id: ObjectId, projection?: ProjectionFields<T>): Promise<T>
  getOneByAny(options: object, projection?: ProjectionFields<T>): Promise<T>
  create(fields: T): Promise<void>
  createOrUpdate(_id: ObjectId, fields: T): Promise<void>
  updateById(_id: ObjectId, fields: T): Promise<void>
}
