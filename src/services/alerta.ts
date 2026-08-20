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
