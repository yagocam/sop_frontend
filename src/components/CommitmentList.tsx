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
  Title,
  NumberInput,
  Textarea,
  Group,
} from '@mantine/core'
import { RootState } from '@/store'
import { createPayment } from '@/store/slices/paymentSlice'
import {
  fetchCommitments,
  deleteCommitment,
  updateCommitment,
  handleDownloadPdf
} from '@/store/slices/CommitmentSlice'
import {
  clearCommitment,
  fetchCommitmentById,
} from '@/store/slices/commitmentDetailsSlice'
import { Commitment } from '@/types'

const CommitmentList: React.FC = () => {
  const dispatch = useDispatch<any>()

  const [commitmentModalOpened, setCommitmentModalOpened] = useState(false)
  const [paymentModalOpened, setPaymentModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)

  const [newPayment, setNewPayment] = useState({ amount: 0, observation: '' })
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null)

  const { commitments, loading: loadingCommitments } = useSelector(
    (state: RootState) => state.commitment
  )

  const commitmentDetails = useSelector(
    (state: RootState) => state.commitmentDetails.commitment
  )

  const loadingDetails = useSelector(
    (state: RootState) => state.commitmentDetails.loading
  )

  useEffect(() => {
    dispatch(fetchCommitments())
  }, [dispatch])

  const handleShowDetails = (commitmentId: number) => {
    setCommitmentModalOpened(true)
    dispatch(fetchCommitmentById(commitmentId))
  }

  const handleCloseCommitmentModal = () => {
    setCommitmentModalOpened(false)
    dispatch(clearCommitment())
  }

  const handleOpenPaymentModal = () => {
    setPaymentModalOpened(true)
    setPaymentError(null)
    setNewPayment({ amount: 0, observation: '' })
  }

  const handleClosePaymentModal = () => {
    setPaymentModalOpened(false)
    setNewPayment({ amount: 0, observation: '' })
    setPaymentError(null)
  }

  const handleCreatePayment = async () => {
    if (!commitmentDetails) return

    try {
      await dispatch(
        createPayment({
          commitment_id: commitmentDetails.id,
          amount: newPayment.amount,
          observation: newPayment.observation,
        })
      ).unwrap()

      handleClosePaymentModal()
      dispatch(fetchCommitmentById(commitmentDetails.id))
    } catch (error: any) {
      const apiError =
        typeof error === 'string'
          ? error
          : error?.response?.data?.error || error?.message || 'Erro ao criar pagamento'
      setPaymentError(apiError)
    }
  }

  const handleEditCommitment = (commitment: Commitment) => {
    setEditingCommitment(commitment)
    setEditModalOpened(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpened(false)
    setEditingCommitment(null)
  }

  const handleUpdateCommitment = async () => {
    if (!editingCommitment) return

    await dispatch(
      updateCommitment({
        id: editingCommitment.id,
        data: {
          amount: editingCommitment.amount,
          observation: editingCommitment.observation,
        },
      })
    )
    handleCloseEditModal()
    dispatch(fetchCommitments())
  }

  const handleDeleteCommitment = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este empenho?')) {
      await dispatch(deleteCommitment(id))
      dispatch(fetchCommitments())
    }
  }

  return (
    <>
      <Stack gap="xl" p="md">
        <Title order={2}>Lista de Empenhos</Title>
        
        <Group justify="space-between" mb="md">
          <Button variant="light" color="grape" onClick={handleDownloadPdf}>
            Baixar Relatório
          </Button>
        </Group>
        {loadingCommitments ? (
          <Center>
            <Loader variant="dots" />
          </Center>
        ) : commitments.length === 0 ? (
          <Center>
            <Text>Nenhum empenho encontrado.</Text>
          </Center>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Valor (R$)</th>
                  <th>Observação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {commitments.map((commitment) => (
                  <tr key={commitment.id}>
                    <td>{commitment.number}</td>
                    <td>R$ {commitment.amount.toFixed(2)}</td>
                    <td>{commitment.observation ?? 'Sem observação'}</td>
                    <td>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          onClick={() => handleShowDetails(commitment.id)}
                        >
                          Ver
                        </Button>
                        <Button
                          size="xs"
                          color="blue"
                          variant="outline"
                          onClick={() => handleEditCommitment(commitment)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          variant="outline"
                          onClick={() => handleDeleteCommitment(commitment.id)}
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

      <Modal
        opened={commitmentModalOpened}
        onClose={handleCloseCommitmentModal}
        title="Detalhes do Empenho"
        size="lg"
        centered
      >
        {loadingDetails ? (
          <Center>
            <Loader variant="dots" />
          </Center>
        ) : commitmentDetails ? (
          <Stack gap="sm">
            <Text>
              <b>ID:</b> {commitmentDetails.id}
            </Text>
            <Text>
              <b>Número:</b> {commitmentDetails.number}
            </Text>
            <Text>
              <b>Valor:</b> R$ {commitmentDetails.amount.toFixed(2)}
            </Text>
            <Text>
              <b>Observação:</b> {commitmentDetails.observation}
            </Text>

            <Button onClick={handleOpenPaymentModal} mt="md" size="sm">
              Adicionar Pagamento
            </Button>

            {Array.isArray(commitmentDetails.payments) && commitmentDetails.payments.length > 0 && (
              <>
                <Text fw={700} mt="md">
                  Pagamentos:
                </Text>
                {commitmentDetails.payments.map((payment) => (
                  <Stack
                    key={payment.id}
                    p="sm"
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 8,
                      backgroundColor: '#fafafa',
                    }}
                    gap={5}
                  >
                    <Text>
                      <b>Número:</b> {payment.number}
                    </Text>
                    <Text>
                      <b>Valor:</b> R$ {payment.amount.toFixed(2)}
                    </Text>
                    <Text>
                      <b>Observação:</b> {payment.observation}
                    </Text>
                  </Stack>
                ))}
              </>
            )}
          </Stack>
        ) : (
          <Text ta="center">Empenho não encontrado.</Text>
        )}
      </Modal>

      <Modal
        opened={paymentModalOpened}
        onClose={handleClosePaymentModal}
        title="Novo Pagamento"
        size="md"
        centered
      >
        <Stack gap="md">
          <NumberInput
            label="Valor"
            min={0}
            p={2}
            value={newPayment.amount}
            onChange={(value) =>
              setNewPayment((prev) => ({ ...prev, amount: Number(value) ?? 0 }))
            }
          />

          <Textarea
            label="Observação"
            value={newPayment.observation}
            onChange={(event) =>
              setNewPayment((prev) => ({ ...prev, observation: event.target.value }))
            }
          />

          {paymentError && (
            <Text c="red" ta="center">
              {paymentError}
            </Text>
          )}

          <Button fullWidth onClick={handleCreatePayment}>
            Criar Pagamento
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={editModalOpened}
        onClose={handleCloseEditModal}
        title="Editar Empenho"
        size="md"
        centered
      >
        {editingCommitment && (
          <Stack gap="md">
            <NumberInput
              label="Valor"
              value={editingCommitment.amount}
              onChange={(value) =>
                setEditingCommitment((prev) =>
                  prev ? { ...prev, amount: Number(value) } : prev
                )
              }
            />
            <Textarea
              label="Observação"
              value={editingCommitment.observation}
              onChange={(e) =>
                setEditingCommitment((prev) =>
                  prev ? { ...prev, observation: e.target.value } : prev
                )
              }
            />
            <Button onClick={handleUpdateCommitment}>Salvar Alterações</Button>
          </Stack>
        )}
      </Modal>
    </>
  )
}

export default CommitmentList
