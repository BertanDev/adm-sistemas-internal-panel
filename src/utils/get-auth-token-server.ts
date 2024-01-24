import { cookies } from 'next/headers'

export const getAuthTokenServer = () => {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value

  return token
}
