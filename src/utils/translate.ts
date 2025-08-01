export function translateStatus(status: string): string {
  switch (status) {
    case 'WAITING_PAYMENT':
      return 'Aguardando Pagamento'
    case 'PAID':
      return 'Pago'
    case 'WAITING_COMMITMENT':
      return 'Aguardando Empenho'
    case 'PARTIALLY_COMMITED':
      return 'Parcialmente Empenhada'
    case 'PARTIALLY_PAYED':
      return 'Parcialmente Pago'
    default:
      return status
  }
}

export function translateType(type: string): string {
  switch (type) {
    case 'OBRA_DE_EDIFICACAO':
      return 'Obra de Edificação'
    case 'OBRA_DE_RODOVIAS':
      return 'Obra de Rodovias'
    default:
      return 'outros'
  }
}
