import React from 'react';
import { Table, ScrollArea, Text } from '@mantine/core';

export default function CommitmentList() {
  const commitments = [
    { id: 1, description: 'Empenho contrato X', amount: 'R$ 3.500,00', date: '2025-06-20' },
    { id: 2, description: 'Empenho serviço Y', amount: 'R$ 4.000,00', date: '2025-07-05' },
  ];

  return (
    <ScrollArea>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {commitments.map(commitment => (
            <tr key={commitment.id}>
              <td>{commitment.description}</td>
              <td>{commitment.amount}</td>
              <td>{commitment.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {commitments.length === 0 && <Text style={{ textAlign: 'center' }} mt="md">Nenhum empenho cadastrado</Text>}
    </ScrollArea>
  );
}
