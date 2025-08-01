import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  ScrollArea,
  Text,
  Loader,
  Center,
  Button,
  Modal,
  Stack,
  Title,
  Textarea,
  NumberInput,
  Group,
  // TextInput removido aqui porque não é usado
} from '@mantine/core'
import api from '@/api/axios'
import { Expense } from '@/types'
import { translateStatus, translateType } from '@/utils/translate'

const ExpenseList: React.FC = () => {
  const dispatch = useDispatch<any>()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(false)

  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/expenses')
      setExpenses(response.data)
    } catch (err) {
      console.error('Erro ao buscar despesas', err)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (expense: Expense) => {
    setSelectedExpense(expense)
    setViewModalOpened(true)
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense({ ...expense })
    setEditModalOpened(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover esta despesa?')) {
      await api.delete(`/api/expenses/${id}`)
      fetchExpenses()
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedExpense) return
    await api.put(`/api/expenses/${selectedExpense.id}`, selectedExpense)
    setEditModalOpened(false)
    fetchExpenses()
  }

  return (
    <>
      <Stack gap="xl" p="md">
        <Title order={2}>Lista de Despesas</Title>

        {loading ? (
          <Center><Loader variant="dots" /></Center>
        ) : expenses.length === 0 ? (
          <Center><Text>Nenhuma despesa encontrada.</Text></Center>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th className="text-center">Protocolo</th>
                  <th className="text-center">Descrição</th>
                  <th className="text-center">Valor (R$)</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="text-center">{expense.protocol_number}</td>
                    <td className="text-center">{expense.description}</td>
                    <td className="text-center">R$ {expense.amount.toFixed(2)}</td>
                    <td>
                      <Group gap="xs">
                        <Button size="xs" onClick={() => handleView(expense)}>
                          Ver
                        </Button>
                        <Button
                          size="xs"
                          color="blue"
                          variant="outline"
                          onClick={() => handleEdit(expense)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          variant="outline"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Remover
                        </Button>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        )}
      </Stack>

      {/* Modal de Visualização */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Detalhes da Despesa"
        size="lg"
        centered
      >
        {selectedExpense && (
          <Stack gap="sm">
            <Text><b>ID:</b> {selectedExpense.id}</Text>
            <Text><b>Protocolo:</b> {selectedExpense.protocol_number}</Text>
            <Text><b>Descrição:</b> {selectedExpense.description}</Text>
            <Text><b>Valor:</b> R$ {selectedExpense.amount.toFixed(2)}</Text>
            <Text><b>Status:</b> {translateStatus(selectedExpense.status ?? '')}</Text>
            <Text><b>Tipo:</b> {translateType(selectedExpense.type ?? '')}</Text>
          </Stack>
        )}
      </Modal>

      {/* Modal de Edição */}
      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Editar Despesa"
        size="md"
        centered
      >
        {selectedExpense && (
          <Stack gap="md">
            <Textarea
              label="Descrição"
              value={selectedExpense.description}
              onChange={(e) =>
                setSelectedExpense((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev
                )
              }
            />
            <NumberInput
              label="Valor"
              value={selectedExpense.amount}
              onChange={(value) =>
                setSelectedExpense((prev) =>
                  prev ? { ...prev, amount: Number(value) ?? 0 } : prev
                )
              }
            />
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </Stack>
        )}
      </Modal>
    </>
  )
}

export default ExpenseList
