import Link from 'next/link'
import { UserRoundPlus } from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import UsersList from '@/components/UsersList'
import { api } from '@/lib/initAxios'
import { getAuthTokenServer } from '@/utils/get-auth-token-server'

export default async function Dashboard() {
  const token = getAuthTokenServer()

  const { data: usersCount } = (await api.get('/get-count-total-users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })) as { data: number }

  return (
    <main className="h-screen w-screen flex">
      <Sidebar />
      <section className="flex-1 p-16">
        <div className=" flex w-full justify-between items-center mb-16">
          <div className="flex flex-col">
            <h2 className="text-2xl text-gray-800 font-semibold">
              Clientes cadastrados
            </h2>
            <p className="text-gray-600">{usersCount} usuários</p>
          </div>

          <Link
            href="/create-user"
            className="bg-blue-500 p-2 text-white rounded-md flex items-center gap-2"
          >
            <UserRoundPlus width={18} height={18} /> Criar usuário
          </Link>
        </div>
        <UsersList />
      </section>
    </main>
  )
}
