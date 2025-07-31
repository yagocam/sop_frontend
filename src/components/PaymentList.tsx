import React from 'react';
import { Table, ScrollArea, Text } from '@mantine/core';

export default function PaymentList() {
  const payments = [
    { id: 1, description: 'Pagamento fornecedor A', amount: 'R$ 2.000,00', date: '2025-06-30' },
    { id: 2, description: 'Pagamento funcionário B', amount: 'R$ 4.200,00', date: '2025-07-12' },
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
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.description}</td>
              <td>{payment.amount}</td>
              <td>{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {payments.length === 0 && <Text style={{ textAlign: 'center' }} mt="md">Nenhum pagamento registrado</Text>}
    </ScrollArea>
  );
}
