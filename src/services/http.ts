import { env } from '@/config/env'

/**
 * Forma del error que devuelve el backend:
 *   { data: null, msg: { code, msg } }
 */
export interface ApiErrorBody {
  code: string
  msg: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, body: ApiErrorBody) {
    super(body.msg)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
  }
}

type Query = Record<string, string | number | boolean | undefined | null>

interface RequestOptions {
  query?: Query
  /** Objeto plano -> JSON. Para subir archivos usar `form`. */
  body?: unknown
  /** FormData para multipart (no setear Content-Type manualmente). */
  form?: FormData
  signal?: AbortSignal
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(path.replace(/^\//, ''), env.apiBaseUrl + '/')
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { query, body, form, signal } = options

  const headers: Record<string, string> = {}
  let payload: BodyInit | undefined

  if (form) {
    payload = form // el navegador arma el boundary de multipart
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: payload,
    signal,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  const json: unknown = text ? JSON.parse(text) : null

  if (!res.ok) {
    const errBody = (json as { msg?: ApiErrorBody })?.msg
    throw new ApiError(
      res.status,
      errBody ?? { code: 'UNKNOWN', msg: 'Error inesperado' },
    )
  }

  return json as T
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>('PATCH', path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>('PUT', path, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
