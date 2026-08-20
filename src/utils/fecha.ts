/**
 * Formatea una fecha (ISO o 'YYYY-MM-DD') a 'dd/mm/aaaa' para mostrar en tablas.
 * Si el valor no es una fecha válida, lo devuelve tal cual.
 */
export function formatearFecha(valor: string): string {
  if (!valor) return ''
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  const dia = String(fecha.getUTCDate()).padStart(2, '0')
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0')
  const anio = fecha.getUTCFullYear()
  return `${dia}/${mes}/${anio}`
}
