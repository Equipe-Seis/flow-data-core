export const useAuth = () => {
  const user = useState('user', () => null)

  const login = (email: string, password: string) => {
    // Simulando usuário fixo
    if (email === 'admin@teste.com' && password === '123456') {
      user.value = { email }
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, login, logout, isAuthenticated }
}
