import { api } from '@/lib/initAxios'
import { getAuthTokenServer } from '@/utils/get-auth-token-server'
import { UserRoundCog } from 'lucide-react'
import Link from 'next/link'

type User = {
  id: string
  email: string
  database_ip: string
  name: string
  firebird_path_database: string
}

export default async function UsersList() {
  const token = getAuthTokenServer()

  const { data: users } = await api.get('/get-all-users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {users.map((user: User) => (
        <li key={user.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <Link
              href={{ pathname: '/create-user', query: { id: user.id } }}
              className="self-center text-blue-600"
            >
              <UserRoundCog width={32} height={32} />
            </Link>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {user.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {user.database_ip} | {user.firebird_path_database}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{user.email}</p>
            <div className="mt-1 flex items-center gap-x-1.5">
              <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs leading-5 text-gray-500">Online</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
