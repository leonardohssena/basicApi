/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import IRequestAdapter, { IRequestAdapterConfig, IRequestAdapterOptions } from './request.protocol'

export default class RequestAdapter implements IRequestAdapter {
  private _instance: AxiosInstance
  constructor(requestConfig: IRequestAdapterConfig) {
    this._instance = axios.create(requestConfig)
  }

  get instance() {
    return this._instance
  }

  private _handleResponse(data: AxiosResponse) {
    return {
      success: true,
      status: data.status || 200,
      data: data.data,
    }
  }

  private _handleError(data: AxiosError) {
    return {
      success: false,
      status: data.status || data.response?.status || 400,
      data: data.response?.data,
    }
  }

  setToken(Authorization: string) {
    this._instance.interceptors.request.use(async (request) => {
      request.headers.Authorization = Authorization
      return Promise.resolve(request)
    })
  }

  async get(url: string, config?: IRequestAdapterOptions) {
    const response = await this._instance.get(url, config).then(this._handleResponse, this._handleError)
    return response
  }

  async post(url: string, payload, config?: IRequestAdapterOptions) {
    const response = await this._instance.post(url, payload, config).then(this._handleResponse, this._handleError)
    return response
  }

  async patch(url: string, payload, config?: IRequestAdapterOptions) {
    const response = await this._instance.patch(url, payload, config).then(this._handleResponse, this._handleError)
    return response
  }

  async delete(url: string, config?: IRequestAdapterOptions) {
    const response = await this._instance.delete(url, config).then(this._handleResponse, this._handleError)
    return response
  }
}
