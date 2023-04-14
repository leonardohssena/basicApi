import os from 'os'

const HOSTNAME = os.hostname()

interface EsInfo {
  '@timestamp': string
  host: string
  level: string
  message: string
  pid: number
  transactionId: string
  duration: number
  data: string
}

export class EsFormat {
  transform(info): EsInfo {
    const result: EsInfo = {
      '@timestamp': info['@timestamp'] || new Date().toISOString(),
      host: HOSTNAME,
      level: info.level,
      message: info.message || '',
      pid: process.pid,
      transactionId: info.metadata.id,
      duration: info.metadata.duration,
      data: JSON.stringify(info.data),
    }

    return result
  }
}

export default function () {
  return new EsFormat()
}
