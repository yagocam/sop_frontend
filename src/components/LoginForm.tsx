'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { loginUser } from '../store/auth/authThunks'
import { TextInput, PasswordInput, Button, Paper, Stack, Text } from '@mantine/core'
import { useAppDispatch } from '@/store/hooks'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error } = useSelector((state: any) => state.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
     try {
    const result = await dispatch(loginUser({ username, password })).unwrap()
    if (result?.token) {
      router.push('/dashboard') 
    }
  } catch (err) {
    console.error('Erro ao fazer login:', err)
  }
  }

  const goToRegister = () => {
    router.push('/register') 
  }

  return (
    <Paper
      style={{ maxWidth: 340, margin: 'auto', marginTop: 24, padding: 24 }}
      mx="auto"
      mt="xl"
      p="xl"
      withBorder
      shadow="md"
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Usuário"
            placeholder="seu usuário"
            required
            value={username}
            onChange={e => setUsername(e.currentTarget.value)}
          />

          <PasswordInput
            label="Senha"
            placeholder="Sua senha"
            required
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
          />

          {error && <Text color="red" size="sm">{error}</Text>}

          <Button type="submit" fullWidth loading={loading}>
            Entrar
          </Button>

          <Stack align="center" mt="md">
            <Button variant="outline" onClick={goToRegister}>
              Criar conta
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  )
}
