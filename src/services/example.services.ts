import { RequestAdapter } from '../adapters'
import IRequestAdapter from '../adapters/request-adapter/request.protocol'
import config from '../config'

export default class TMDBService {
  private request: IRequestAdapter
  constructor() {
    this.request = new RequestAdapter({
      baseURL: config.example.baseURL,
      params: { api_key: config.example.apiKey },
    })
  }

  async get(): Promise<any> {
    return (await this.request.get('/'))?.data
  }
}
