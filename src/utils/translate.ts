export function translateStatus(status: string): string {
  switch (status) {
    case 'WAITING_PAYMENT':
      return 'Aguardando Pagamento'
    case 'PAID':
      return 'Pago'
    case 'CANCELED':
      return 'Cancelado'
    default:
      return status
  }
}

export function translateType(type: string): string {
  switch (type) {
    case 'OBRA_DE_EDIFICACAO':
      return 'Obra de Edificação'
    case 'SERVICO_PRESTADO':
      return 'Serviço Prestado'
    default:
      return type
  }
}
