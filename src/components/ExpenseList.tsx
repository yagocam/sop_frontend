import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Table,
  ScrollArea,
  Text,
  Loader,
  Center,
  Button,
  Modal,
  Stack,
  TextInput,
  Title,
  NumberInput,
  Textarea,
} from '@mantine/core'
import api from '@/api/axios'
import {
  fetchExpenseById,
  clearExpense,
} from '@/store/slices/expenseDetailsSlice'
import { createCommitment } from '@/store/slices/CommitmentSlice' 
import { RootState } from '@/store'
import { Expense } from '@/types'
import { translateStatus, translateType } from '@/utils/translate'

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [modalOpened, setModalOpened] = useState(false)
  const [commitmentModalOpened, setCommitmentModalOpened] = useState(false)
  const [newCommitment, setNewCommitment] = useState({
    number: '',
    amount: 0,
    observation: '',
  })

  const dispatch = useDispatch<any>()

  const {
    expense: selectedExpense,
    loading: loadingDetails,
    error: errorDetails,
  } = useSelector((state: RootState) => state.expenseDetails)

  useEffect(() => {
    api.get<Expense[]>('/api/expenses').then((response) => {
      setExpenses(response.data)
    })
  }, [])

  const handleShowDetails = (id: number) => {
    dispatch(fetchExpenseById(id))
    setModalOpened(true)
  }

  const handleCloseModal = () => {
    setModalOpened(false)
    dispatch(clearExpense())
  }

  const handleOpenCommitmentModal = () => {
    setCommitmentModalOpened(true)
  }

  const handleCloseCommitmentModal = () => {
    setCommitmentModalOpened(false)
    setNewCommitment({ number: '', amount: 0, observation: '' })
  }
const [commitmentError, setCommitmentError] = useState<string | null>(null)
  const handleCreateCommitment = async () => {
    if (!selectedExpense) return

    try {
      await dispatch(
        createCommitment({
          expense_id: selectedExpense.id,
          number: newCommitment.number,
          amount: newCommitment.amount,
          observation: newCommitment.observation,
        })
      ).unwrap()

      handleCloseCommitmentModal()
      dispatch(fetchExpenseById(selectedExpense.id))
    } catch (error: any) {
  console.error("Erro ao criar empenho:", error)

  const apiError = error?.response?.data?.error || error?.message || 'Erro ao criar empenho'
  setCommitmentError(apiError)
}
  }

  return (
    <>
      <Stack spacing="xl" p="md">
        <Title order={2}>Lista de Despesas</Title>

        {expenses.length === 0 && (
          <Center>
            <Text>Nenhuma despesa encontrada.</Text>
          </Center>
        )}

        <ScrollArea>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Descrição</th>
                <th>Valor (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.protocol_number}</td>
                  <td>{expense.description}</td>
                  <td>{expense.amount.toFixed(2)}</td>
                  <td>
                    <Button size="xs" onClick={() => handleShowDetails(expense.id)}>
                      Ver Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title="Detalhes da Despesa"
        size="lg"
        centered
      >
        {loadingDetails && (
          <Center>
            <Loader variant="dots" />
          </Center>
        )}

        {errorDetails && (
          <Text color="red" align="center">
            {errorDetails}
          </Text>
        )}

        {selectedExpense && !loadingDetails && !errorDetails && (
          <Stack spacing="sm">
            <Text>
              <b>ID:</b> {selectedExpense.id}
            </Text>
            <Text>
              <b>Protocolo:</b> {selectedExpense.protocol_number}
            </Text>
            <Text>
              <b>Descrição:</b> {selectedExpense.description}
            </Text>
            <Text>
              <b>Valor:</b> R$ {selectedExpense.amount.toFixed(2)}
            </Text>
            <Text>
              <b>Status:</b> {translateStatus(selectedExpense.status ?? '')}
            </Text>
            <Text>
              <b>Tipo:</b> {translateType(selectedExpense.type ?? '')}
            </Text>

            <Button onClick={handleOpenCommitmentModal} mt="md" size="sm">
              Adicionar Empenho
            </Button>

            {selectedExpense.commitments && selectedExpense.commitments.length > 0 && (
              <>
                <Text weight={700} mt="md">
                  Empenhos:
                </Text>
                {selectedExpense.commitments.map((commitment) => (
                  <Stack
                    key={commitment.id}
                    p="sm"
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 8,
                      backgroundColor: '#fafafa',
                    }}
                    spacing={5}
                  >
                    <Text>
                      <b>ID:</b> {commitment.id}
                    </Text>
                    <Text>
                      <b>Número:</b> {commitment.number}
                    </Text>
                    <Text>
                      <b>Valor:</b> R$ {commitment.amount.toFixed(2)}
                    </Text>
                    <Text>
                      <b>Observação:</b> {commitment.observation}
                    </Text>
                  </Stack>
                ))}
              </>
            )}
          </Stack>
        )}

        {!selectedExpense && !loadingDetails && !errorDetails && (
          <Text align="center" color="dimmed">
            Nenhum detalhe disponível.
          </Text>
        )}
      </Modal>

      <Modal
        opened={commitmentModalOpened}
        onClose={handleCloseCommitmentModal}
        title="Novo Empenho"
        size="md"
        centered
      >
        <Stack spacing="md">
          <NumberInput
            label="Valor"
            min={0}
            precision={2}
            value={newCommitment.amount}
            onChange={(value) =>
              setNewCommitment((prev) => ({ ...prev, amount: Number(value) ?? 0 }))
            }
          />
          
        <Textarea
          label="Observação"
          value={newCommitment.observation}
          onChange={(event) =>
            setNewCommitment((prev) => ({ ...prev, observation: event.target.value ?? '' }))
          }
        />

        {commitmentError && (
          <Text color="red" align="center" mb="sm">
            {commitmentError}
          </Text>
        )}
          
          <Button fullWidth onClick={handleCreateCommitment}>
            Criar Empenho
          </Button>
        </Stack>
      </Modal>
    </>
  )
}

export default ExpenseList
