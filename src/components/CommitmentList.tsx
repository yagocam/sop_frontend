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
} from '@mantine/core'
import { RootState } from '@/store'
import {
  createPayment,
  clearPayments,
} from '@/store/slices/paymentSlice'
import { fetchCommitments } from '@/store/slices/CommitmentSlice'
import {
  clearCommitment,
  fetchCommitmentById,
} from '@/store/slices/commitmentDetailsSlice'

const CommitmentList: React.FC = () => {
  const dispatch = useDispatch<any>()

  const [commitmentModalOpened, setCommitmentModalOpened] = useState(false)
  const [paymentModalOpened, setPaymentModalOpened] = useState(false)
  const [newPayment, setNewPayment] = useState({ amount: 0, observation: '' })
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const { payments, loading: loadingPayments, error: errorPayments } = useSelector(
    (state: RootState) => state.payment
  )

  const { commitments, loading: loadingCommitments } = useSelector(
    (state: RootState) => state.commitment
  )

  const commitmentDetails = useSelector(
    (state: RootState) => state.commitmentDetails.commitment
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
    dispatch(clearPayments())
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

  return (
    <>
      <Stack spacing="xl" p="md">
        <Title order={2}>Lista de Empenhos</Title>

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
                    <td>{commitment.amount.toFixed(2)}</td>
                    <td>{commitment.observation}</td>
                    <td>
                      <Button size="xs" onClick={() => handleShowDetails(commitment.id)}>
                        Ver Detalhes
                      </Button>
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
        {loadingPayments && (
          <Center>
            <Loader variant="dots" />
          </Center>
        )}

        {errorPayments && (
          <Text c="red" ta="center">
            {typeof errorPayments === 'string'
              ? errorPayments
              : errorPayments?.error || 'Erro ao carregar pagamentos'}
          </Text>
        )}

        {commitmentDetails && (
          <Stack spacing="sm">
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

            {commitmentDetails.payments && commitmentDetails.payments.length > 0 && (
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
        )}
      </Modal>

      <Modal
        opened={paymentModalOpened}
        onClose={handleClosePaymentModal}
        title="Novo Pagamento"
        size="md"
        centered
      >
        <Stack spacing="md">
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
    </>
  )
}

export default CommitmentList
