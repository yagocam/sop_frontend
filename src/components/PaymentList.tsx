import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPayments,
  selectPayments,
  updatePayment,
  deletePayment,
} from '@/store/slices/paymentSlice'
import { AppDispatch } from '@/store'
import {
  Card,
  Text,
  Group,
  Button,
  Modal,
  Stack,
  TextInput,
  NumberInput,
} from '@mantine/core'

export default function PaymentList() {
  const dispatch = useDispatch<AppDispatch>()
  const { payments, loading, error } = useSelector(selectPayments)

  const [modalOpened, setModalOpened] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [editMode, setEditMode] = useState(false)

  const [editAmount, setEditAmount] = useState(0)
  const [editObservation, setEditObservation] = useState('')

  useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  const openDetails = (payment: any) => {
    setSelectedPayment(payment)
    setEditAmount(payment.amount)
    setEditObservation(payment.observation || '')
    setEditMode(false)
    setModalOpened(true)
  }

  const closeModal = () => {
    setModalOpened(false)
    setSelectedPayment(null)
    setEditMode(false)
  }

  const handleEditSave = async () => {
    if (!selectedPayment) return

    await dispatch(
      updatePayment({
        id: selectedPayment.id,
        data: {
          commitment_id: selectedPayment.commitment.id,
          amount: editAmount,
          observation: editObservation,
        },
      })
    )

    setEditMode(false)
    closeModal()
  }

  const handleDelete = async () => {
    if (!selectedPayment) return

    await dispatch(deletePayment(selectedPayment.id))
    closeModal()
  }

  if (loading) return <Text ta="center">Carregando pagamentos...</Text>
  if (error)
    return (
      <Text c="red" ta="center">
        {typeof error === 'string' ? error : JSON.stringify(error)}
      </Text>
    )

  if (!payments.length) return <Text ta="center">Nenhum pagamento registrado.</Text>

  return (
    <>
      <div>
        {payments.map((payment) => (
          <Card key={payment.id} shadow="sm" padding="md" mb="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Pagamento #{payment.id}</Text>
              <Text size="sm" c="gray">
                Criado em: {new Date(payment.created_at).toLocaleString('pt-BR')}
              </Text>
            </Group>
            <Text>
              <strong>Número:</strong> {payment.number}
            </Text>
            <Text>
              <strong>Valor:</strong> R$ {payment.amount.toFixed(2)}
            </Text>
            {payment.observation && (
              <Text mt="xs">
                <strong>Observação:</strong> {payment.observation}
              </Text>
            )}
            <Button mt="md" onClick={() => openDetails(payment)}>
              Ver Detalhes
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Detalhes do Pagamento"
        size="md"
        centered
      >
        {selectedPayment && (
          <Stack gap="sm">
            {!editMode ? (
              <>
                <Text>
                  <strong>ID:</strong> {selectedPayment.id}
                </Text>
                <Text>
                  <strong>Número:</strong> {selectedPayment.number}
                </Text>
                <Text>
                  <strong>Valor:</strong> R$ {selectedPayment.amount.toFixed(2)}
                </Text>
                {selectedPayment.observation && (
                  <Text>
                    <strong>Observação:</strong> {selectedPayment.observation}
                  </Text>
                )}

                <Group align="right" mt="md" gap="sm">
                  <Button
                    variant="outline"
                    color="blue"
                    onClick={() => setEditMode(true)}
                  >
                    Editar
                  </Button>
                  <Button variant="outline" color="red" onClick={handleDelete}>
                    Excluir
                  </Button>
                </Group>
              </>
            ) : (
              <>
                <NumberInput
                  label="Valor"
                  min={0}
                  value={editAmount}
                  onChange={(val) => setEditAmount(Number(val) || 0)}
                  p={2}
                />
                <TextInput
                  label="Observação"
                  value={editObservation}
                  onChange={(e) => setEditObservation(e.currentTarget.value)}
                />

                <Group align="right" mt="md" gap="sm">
                  <Button color="green" onClick={handleEditSave}>
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        )}
      </Modal>
    </>
  )
}
