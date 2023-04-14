import { ObjectId } from 'mongodb'
import { Model, ProjectionFields } from 'mongoose'
import IDatabaseRepository from './database.protocol'

export default class DatabasePrototype<T> implements IDatabaseRepository<T> {
  private schema: Model<T>
  constructor(schema: Model<T>) {
    this.schema = schema
  }

  async getOneById(_id: ObjectId, projection?: ProjectionFields<T>): Promise<T> {
    return this.schema.findById(_id, projection)
  }

  async getOneByAny(options: object, projection?: ProjectionFields<T>): Promise<T> {
    return this.schema.findOne(
      {
        ...options,
        deleted: false,
      },
      projection,
    )
  }

  async create(fields: T): Promise<void> {
    await this.schema.create(fields)
  }

  async createOrUpdate(_id: ObjectId, fields: T): Promise<void> {
    await this.schema.findByIdAndUpdate(
      _id,
      {
        $set: fields,
      },
      {
        upsert: true,
      },
    )
  }

  async updateById(_id: ObjectId, fields: T): Promise<void> {
    await this.schema.findByIdAndUpdate(_id, {
      $set: fields,
    })
  }
}
