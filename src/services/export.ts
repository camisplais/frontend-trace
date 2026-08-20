/**
 * Construye el contenido de un CSV (función pura, fácil de testear).
 */
export function construirCsv(
  columnas: string[],
  filas: (string | number)[][],
): string {
  const escapar = (valor: string | number) => {
    const texto = String(valor)
    return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
  }

  return [
    columnas.map(escapar).join(','),
    ...filas.map((fila) => fila.map(escapar).join(',')),
  ].join('\n')
}

/**
 * Exporta filas a un archivo CSV y dispara la descarga en el navegador.
 * Stopgap hasta que exista un endpoint de exportación en el backend.
 */
export function exportarCsv(
  nombreArchivo: string,
  columnas: string[],
  filas: (string | number)[][],
): void {
  const contenido = construirCsv(columnas, filas)
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}
