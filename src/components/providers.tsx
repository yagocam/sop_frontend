'use client';

import '@mantine/core/styles.css';
import { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { MantineProvider, } from '@mantine/core';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <MantineProvider
        theme={{
          fontFamily: 'Open Sans, sans-serif',
          primaryColor: 'blue',
        }}
      >
        {children}
      </MantineProvider>
    </ReduxProvider>
  );
}
