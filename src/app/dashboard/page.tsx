import React from 'react';
import Header from '../../components/Header'
import DashboardTabs from '../../components/DashboardTabs'
import { Container } from '@mantine/core';

export default function DashboardPage() {
  return (
    <Container size="lg" py="md" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Header />
      <DashboardTabs />
    </Container>
  );
}
