import React, { useEffect, useState } from 'react';
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
  NativeSelect,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import api from '@/api/axios';
import { translateStatus, translateType } from '@/utils/translate';

type ExpenseType = 'OBRA_DE_EDIFICACAO' | 'OBRA_DE_RODOVIAS' | 'OUTROS';

interface Commitment {
  id: number;
  observation: string;
  amount: number;
  number: string ;
}

interface Expense {
  id: number;
  protocol_number: string;
  description: string;
  responsable: string;
  amount: number;
  status?: string;
  type: ExpenseType;
  expires_at?: string | null;
  commitments?: Commitment[];
}

const expenseTypeData = [
  { value: 'OBRA_DE_EDIFICACAO', label: 'Obra de Edificação' },
  { value: 'OBRA_DE_RODOVIAS', label: 'Obra de Rodovias' },
  { value: 'OUTROS', label: 'Outros' },
];

const validTypes: ExpenseType[] = ['OBRA_DE_EDIFICACAO', 'OBRA_DE_RODOVIAS', 'OUTROS'];

const getTomorrowISO = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [createExpenseModalOpened, setCreateExpenseModalOpened] = useState(false);
  const [createCommitmentModalOpened, setCreateCommitmentModalOpened] = useState(false);

  const [newDescription, setNewDescription] = useState('');
  const [newResponsable, setNewResponsable] = useState('');
  const [newAmount, setNewAmount] = useState<number | undefined>(undefined);
  const [newType, setNewType] = useState<ExpenseType>('OBRA_DE_EDIFICACAO');
  const [newExpiresAt, setNewExpiresAt] = useState<string | null>(getTomorrowISO());

  const [newCommitmentObersvation, setNewCommitmentObservation] = useState('');
  const [newCommitmentAmount, setNewCommitmentAmount] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Erro ao buscar despesas', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (expense: Expense) => {
    setSelectedExpense(expense);
    setViewModalOpened(true);
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense({ ...expense });
    setEditModalOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover esta despesa?')) {
      await api.delete(`/api/expenses/${id}`);
      fetchExpenses();
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedExpense || !validTypes.includes(selectedExpense.type)) return;

    await api.put(`/api/expenses/${selectedExpense.id}`, {
      ...selectedExpense,
      expires_at: selectedExpense.expires_at ?? getTomorrowISO(),
    });

    setEditModalOpened(false);
    fetchExpenses();
  };

  const handleCreateExpense = async () => {
    if (!newDescription.trim() || !newAmount || !newType) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await api.post('/api/expenses', {
        responsable: newResponsable,
        description: newDescription,
        amount: newAmount,
        type: newType,
        expires_at: newExpiresAt ?? getTomorrowISO(),
      });

      setCreateExpenseModalOpened(false);
      setNewDescription('');
      setNewAmount(undefined);
      setNewType('OBRA_DE_EDIFICACAO');
      setNewResponsable('');
      setNewExpiresAt(getTomorrowISO());
      fetchExpenses();
    } catch (error) {
      console.error('Erro ao criar despesa', error);
      alert('Erro ao criar despesa');
    }
  };

  const handleCreateCommitment = async () => {
    if (!newCommitmentObersvation.trim() || !newCommitmentAmount || !selectedExpense) {
      alert('Preencha descrição e valor para o novo empenho');
      return;
    }

    try {
      await api.post(`/api/commitments/`, {
        observation: newCommitmentObersvation,
        amount: newCommitmentAmount,
        expense_id: selectedExpense.id ,
      });

      setCreateCommitmentModalOpened(false);
      setNewCommitmentObservation('');
      setNewCommitmentAmount(undefined);

      fetchExpenses();
      setViewModalOpened(false);
    } catch (error) {
      console.error('Erro ao criar empenho', error);
      alert('Erro ao criar empenho');
    }
  };

  return (
    <>
      <Stack gap="xl" p="md">
        <Title order={2}>Lista de Despesas</Title>
        <Button onClick={() => setCreateExpenseModalOpened(true)} mb="md">
          Nova Despesa
        </Button>

        {loading ? (
          <Center><Loader variant="dots" /></Center>
        ) : expenses.length === 0 ? (
          <Center><Text>Nenhuma despesa encontrada.</Text></Center>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Descrição</th>
                  <th>Valor (R$)</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.protocol_number}</td>
                    <td>{expense.description}</td>
                    <td>R$ {expense.amount.toFixed(2)}</td>
                    <td>{translateType(expense.type)}</td>
                    <td>
                      <Group gap="xs">
                        <Button size="xs" onClick={() => handleView(expense)}>Ver</Button>
                        <Button size="xs" variant="outline" onClick={() => handleEdit(expense)}>Editar</Button>
                        <Button size="xs" variant="outline" color="red" onClick={() => handleDelete(expense.id)}>Remover</Button>
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
            <Text><b>Responsável:</b> {selectedExpense.responsable}</Text>
            <Text><b>Valor:</b> R$ {selectedExpense.amount.toFixed(2)}</Text>
            <Text><b>Status:</b> {translateStatus(selectedExpense.status ?? '')}</Text>
            <Text><b>Tipo:</b> {translateType(selectedExpense.type)}</Text>
            <Text>
              <b>Vencimento:</b>{' '}
              {selectedExpense.expires_at ? dayjs(selectedExpense.expires_at).format('DD/MM/YYYY HH:mm') : '-'}
            </Text>

            <Stack mt="md" gap="xs">
              <Text w={600}>Compromissos:</Text>
              {selectedExpense.commitments && selectedExpense.commitments.length > 0 ? (
                selectedExpense.commitments.map((commitment) => (
                  <Stack
                    key={commitment.id}
                    gap={2}
                    px="sm"
                    py="xs"
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 8,
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Text size="sm"><b>Número:</b> {commitment.number}</Text>
                    <Text size="sm"><b>Observação:</b> {commitment.observation}</Text>
                    <Text size="sm"><b>Valor:</b> R$ {commitment.amount.toFixed(2)}</Text>
                  </Stack>
                ))
              ) : (
                <Text size="sm" color="dimmed">Nenhum compromisso encontrado.</Text>
              )}
            </Stack>

            <Button
              mt="md"
              onClick={() => {
                setViewModalOpened(false);
                setCreateCommitmentModalOpened(true);
              }}
            >
              Criar Novo Empenho
            </Button>
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
              onChange={(e) => setSelectedExpense((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
            />
            <Textarea
              label="Responsável"
              value={selectedExpense.responsable}
              onChange={(e) => setSelectedExpense((prev) => (prev ? { ...prev, responsable: e.target.value } : prev))}
            />
            <NumberInput
              label="Valor"
              value={selectedExpense.amount}
              min={0}
              onChange={(val) => setSelectedExpense((prev) => (prev ? { ...prev, amount: Number(val) } : prev))}
            />
            <NativeSelect
              label="Tipo"
              data={expenseTypeData}
              value={selectedExpense.type}
              onChange={(e) => {
                const value = e.currentTarget.value as ExpenseType;
                if (validTypes.includes(value)) setSelectedExpense((prev) => (prev ? { ...prev, type: value } : prev));
              }}
            />
            <DateInput
              label="Vencimento"
              value={selectedExpense.expires_at}
              onChange={(value) =>
                setSelectedExpense((prev) =>
                  prev ? { ...prev, expires_at: value ?? getTomorrowISO() } : prev
                )
              }
            />
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </Stack>
        )}
      </Modal>

      {/* Modal de Criação de Expense */}
      <Modal
        opened={createExpenseModalOpened}
        onClose={() => setCreateExpenseModalOpened(false)}
        title="Nova Despesa"
        size="md"
        centered
      >
        <Stack gap="md">
          <Textarea label="Descrição" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
          <Textarea label="Responsável" value={newResponsable} onChange={(e) => setNewResponsable(e.target.value)} />
          <NumberInput label="Valor" value={newAmount} onChange={(value) => setNewAmount(Number(value))} min={0} />
          <NativeSelect label="Tipo" data={expenseTypeData} value={newType} onChange={(e) => setNewType(e.currentTarget.value as ExpenseType)} />
          <DateInput
            label="Vencimento"
            value={newExpiresAt}
            onChange={(value) => setNewExpiresAt(value ?? getTomorrowISO())}
          />
          <Button onClick={handleCreateExpense}>Criar Despesa</Button>
        </Stack>
      </Modal>

      {/* Modal de Criação de Commitment */}
      <Modal
        opened={createCommitmentModalOpened}
        onClose={() => setCreateCommitmentModalOpened(false)}
        title="Novo Empenho"
        size="md"
        centered
      >
        <Stack gap="md">
          <Textarea
            label="Observação"
            value={newCommitmentObersvation}
            onChange={(e) => setNewCommitmentObservation(e.target.value)}
          />
          <NumberInput
            label="Valor"
            value={newCommitmentAmount}
            onChange={(value) => setNewCommitmentAmount(Number(value))}
            min={0}
          />
          <Button onClick={handleCreateCommitment}>Criar Empenho</Button>
        </Stack>
      </Modal>
    </>
  );
};

export default ExpenseList;
