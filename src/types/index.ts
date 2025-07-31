export interface Expense {
  id: number
  protocol_number: string
  type: 'Obra de Edificação' | 'Obra de Rodovias' | 'Outros'
  created_at: Date 
  expires_at: Date
  responsable: string
  description: string
  amount: number
  status?: 'Aguardando Empenho' | 'Parcialmente Empenhada' | 'Aguardando Pagamento' | 'Parcialmente Paga' | 'Paga'
  commitments?: Commitment[]
}

export interface Commitment {
  id: number
  number: string
  created_at: Date
  amount: number
  observation: string
  expense_id: number
  expense: Expense
  payments?: Payment[]
}

export interface Payment {
  id: number
  number: string
  created_at: Date
  amount: number
  observation: string
  commitment: Commitment
  commitment_id: number
}
