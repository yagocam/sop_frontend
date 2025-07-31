'use client'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { registerUser } from '../store/auth/authThunks'
import { resetRegisterSuccess } from '../store/slices/authSlice' 
import { TextInput, PasswordInput, Button, Box, Notification } from '@mantine/core'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error, registerSuccess } = useAppSelector(state => state.auth)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(registerUser({ name, email, password, roles:'ADMIN'}))
  }

  useEffect(() => {
    if (registerSuccess) {
      router.push('/login')
      dispatch(resetRegisterSuccess()) 
    }
  }, [registerSuccess, router, dispatch])

  return (
    <Box maw={320} mx="auto" mt="xl" p="md" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nome"
          placeholder="Seu nome"
          required
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          mb="sm"
        />
        <TextInput
          label="Email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
          mb="sm"
        />

        <PasswordInput
          label="Senha"
          placeholder="Sua senha"
          required
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
          mb="sm"
        />

        {error && <Notification color="red" mb="sm">{error}</Notification>}

        <Button type="submit" fullWidth loading={loading}>
          Registrar
        </Button>
      </form>
    </Box>
  )
}
