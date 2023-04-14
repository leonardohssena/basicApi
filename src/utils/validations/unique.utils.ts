import uniqueValidator from 'mongoose-unique-validator'

import { UNIQUE } from './messages.utils'

export default (Schema) =>
  Schema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: UNIQUE,
  })
