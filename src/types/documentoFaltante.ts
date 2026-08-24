export interface DocumentoFaltante {
  doc_cliente_id: number
  documento_nombre: string
}
export interface DocsFaltantesEmbarque {
  embarque_id: number
  cliente_nombre: string
  total_requeridos: number
  total_subidos: number
  docsFaltantes: DocumentoFaltante[]
}
