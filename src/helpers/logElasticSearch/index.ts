import { LogData, ElasticsearchTransport, ElasticsearchTransportOptions } from 'winston-elasticsearch'
import esFormat from './esFormat'
import config from '../../config'

function esTransformer({ message, level, meta }: LogData) {
  return { message, level, ...meta }
}

const esTransport = new ElasticsearchTransport({
  transformer: esTransformer,
  clientOpts: {
    node: config.log.elasticsearchUrl,
  },
  indexPrefix: 'log',
  indexSuffixPattern: 'YYYYMMDD',
  format: esFormat(),
} as ElasticsearchTransportOptions)

export default esTransport
