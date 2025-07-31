'use client';

import React from 'react';
import { Group, Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };


  return (
    <Group style={{ justifyContent: 'space-between' }}>
      <Text size="xl" style={{ fontWeight: 700 }}>
        Bem-vindo
      </Text>
      <Button variant="outline" color="red" onClick={handleLogout}>
        Sair
      </Button>
    </Group>
  );
}
