/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHeaders {
  [key: string]: string
}

export interface IRequestAdapterConfig {
  baseURL: string
  headers?: IHeaders
  params?: { [key: string]: any }
}

export interface IRequestAdapterOptions {
  headers?: IHeaders
  params?: { [key: string]: any }
  data?: { [key: string]: any }
}

export type TRequestAdapterResponse = {
  success: boolean
  status: number
  data: unknown
}

export default interface IRequestAdapter {
  get(url: string, config?: IRequestAdapterOptions): Promise<TRequestAdapterResponse>
  post(url: string, payload, config?: IRequestAdapterOptions): Promise<TRequestAdapterResponse>
  patch(url: string, payload, config?: IRequestAdapterOptions): Promise<TRequestAdapterResponse>
  delete(url: string, config?: IRequestAdapterOptions): Promise<TRequestAdapterResponse>
}
