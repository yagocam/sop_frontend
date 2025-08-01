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
import api from '@/api/axios';
import { translateStatus, translateType } from '@/utils/translate';

type ExpenseType = 'OBRA_DE_EDIFICACAO' | 'OBRA_DE_RODOVIAS' | 'OUTROS';

interface Expense {
  id: number;
  protocol_number: string;
  description: string;
  responsable: string;
  amount: number;
  status?: string;
  type: ExpenseType;
}

const expenseTypeData = [
  { value: 'OBRA_DE_EDIFICACAO', label: 'Obra de Edificação' },
  { value: 'OBRA_DE_RODOVIAS', label: 'Obra de Rodovias' },
  { value: 'OUTROS', label: 'Outros' },
];

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const [newDescription, setNewDescription] = useState('');
  const [newResponsable, setNewResponsable] = useState('');
  const [newAmount, setNewAmount] = useState<number | undefined>(undefined);
  const [newType, setNewType] = useState<ExpenseType | ''>('');

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
    if (!selectedExpense) return;
    await api.put(`/api/expenses/${selectedExpense.id}`, selectedExpense);
    setEditModalOpened(false);
    fetchExpenses();
  };

  const handleCreateExpense = async () => {
    if (!newDescription.trim() || !newAmount || !newType) {
      alert('Por favor, preencha descrição, valor e tipo');
      return;
    }
    try {
      await api.post('/api/expenses', {
        responsable: newResponsable,
        description: newDescription,
        amount: newAmount,
        type: newType,
      });
      setCreateModalOpened(false);
      setNewDescription('');
      setNewAmount(undefined);
      setNewType('');
      setNewResponsable('');
      fetchExpenses();
    } catch (error) {
      console.error('Erro ao criar despesa', error);
      alert('Erro ao criar despesa');
    }
  };

  return (
    <>
      <Stack gap="xl" p="md">
        <Title order={2}>Lista de Despesas</Title>

        <Button onClick={() => setCreateModalOpened(true)} mb="md">
          Nova Despesa
        </Button>

        {loading ? (
          <Center>
            <Loader variant="dots" />
          </Center>
        ) : expenses.length === 0 ? (
          <Center>
            <Text>Nenhuma despesa encontrada.</Text>
          </Center>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th className="text-center">Protocolo</th>
                  <th className="text-center">Descrição</th>
                  <th className="text-center">Valor (R$)</th>
                  <th className="text-center">Tipo</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="text-center">{expense.protocol_number}</td>
                    <td className="text-center">{expense.description}</td>
                    <td className="text-center">R$ {expense.amount.toFixed(2)}</td>
                    <td className="text-center">{translateType(expense.type ?? '')}</td>
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
        withinPortal={false}
      >
        {selectedExpense && (
          <Stack gap="sm">
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
              <b>Responsavel:</b> {selectedExpense.responsable}
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
        withinPortal={false}
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
            <Textarea
              label="Responsavel"
              value={selectedExpense.responsable}
              onChange={(e) =>
                setSelectedExpense((prev) =>
                  prev ? { ...prev, responsable: e.target.value } : prev
                )
              }
            />
            <NativeSelect
              label="Tipo"
              data={expenseTypeData}
              value={selectedExpense?.type ?? ''}
              onChange={(event) => {
                const value = event.currentTarget.value as ExpenseType;
                if (!selectedExpense) return;
                setSelectedExpense({
                  ...selectedExpense,
                  type: value,
                });
              }}
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

      <Modal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        title="Nova Despesa"
        size="md"
        centered
      >
        <Stack gap="md">
          <Textarea
            label="Descrição"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Textarea
            label="Responsavel"
            value={newResponsable}
            onChange={(e) => setNewResponsable(e.target.value)}
          />
          <NumberInput
            label="Valor"
            value={newAmount}
            onChange={(value) => setNewAmount(Number(value) ?? undefined)}
            min={0}
          />
          <NativeSelect
            label="Tipo"
            data={expenseTypeData}
            value={newType}
            onChange={(event) => setNewType(event.currentTarget.value as ExpenseType)}
          />
          <Button onClick={handleCreateExpense}>Criar Despesa</Button>
        </Stack>
      </Modal>
    </>
  );
};

export default ExpenseList;
