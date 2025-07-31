'use client';

import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import ExpenseList from './ExpenseList';
import CommitmentList from './CommitmentList';
import PaymentList from './PaymentList';

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<string | null>('expenses');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="expenses">Despesas</Tabs.Tab>
        <Tabs.Tab value="commitments">Empenhos</Tabs.Tab>
        <Tabs.Tab value="payments">Pagamentos</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="expenses" pt="md">
        <ExpenseList />
      </Tabs.Panel>

      <Tabs.Panel value="commitments" pt="md">
        <CommitmentList />
      </Tabs.Panel>

      <Tabs.Panel value="payments" pt="md">
        <PaymentList />
      </Tabs.Panel>
    </Tabs>
  );
}
