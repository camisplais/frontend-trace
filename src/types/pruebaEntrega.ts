export interface DocumentoEntrega {
  id: number
  documento_nombre: string
  plan_embarque: string
  tipo: 'regular' | 'expeditado'
  createdAt: string
}

export interface DocumentosMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DocumentosRespuesta {
  data: DocumentoEntrega[]
  meta: DocumentosMeta
}

export interface FiltroPruebas {
  cliente_id: number
  anio?: string
  mes?: string
  tipo?: string
  search?: string
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
  limit?: number
}
