import Swal from 'sweetalert2'
import type { SweetAlertResult } from 'sweetalert2'

const swal = Swal.mixin({
  confirmButtonColor: '#f57c1f',
  cancelButtonColor: '#6b7280',
  buttonsStyling: true,
  reverseButtons: true,
})

export const alerta = {
  exito(titulo: string, texto?: string): Promise<SweetAlertResult> {
    return swal.fire({
      icon: 'success',
      iconColor: '#16a34a',
      title: titulo,
      text: texto,
      confirmButtonText: 'OK',
    })
  },

  error(titulo: string, texto?: string): Promise<SweetAlertResult> {
    return swal.fire({
      icon: 'error',
      title: titulo,
      text: texto,
      confirmButtonText: 'OK',
    })
  },

  /**
   * Variante de error que además muestra el código de error del backend como
   * chip (ej. FILE_001), tal como en el diseño "Revisa el formulario".
   */
  errorCodigo(
    titulo: string,
    texto: string,
    codigo?: string,
  ): Promise<SweetAlertResult> {
    const escapar = (s: string) =>
      s.replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
      )
    const chip = codigo
      ? `<div style="margin-top:12px"><span style="display:inline-block;padding:4px 10px;border-radius:6px;background:#f3f4f6;color:#6b7280;font-size:12px;font-weight:600;letter-spacing:.03em">${escapar(codigo)}</span></div>`
      : ''
    return swal.fire({
      icon: 'warning',
      iconColor: '#f57c1f',
      title: titulo,
      html: `<p style="margin:0;color:#6b7280">${escapar(texto)}</p>${chip}`,
      confirmButtonText: 'OK',
    })
  },

  async confirmar(
    titulo: string,
    opciones?: { texto?: string; confirmText?: string; cancelText?: string },
  ): Promise<boolean> {
    const res = await swal.fire({
      icon: 'question',
      iconColor: '#f57c1f',
      title: titulo,
      text: opciones?.texto,
      showCancelButton: true,
      confirmButtonText: opciones?.confirmText ?? 'OK',
      cancelButtonText: opciones?.cancelText ?? 'Cancelar',
    })
    return res.isConfirmed
  },
}
