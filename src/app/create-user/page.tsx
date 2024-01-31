'use client'

import { Tooltip as ReactTooltip } from 'react-tooltip'
import { api } from '@/lib/initAxios'
import { isValidCNPJ } from '@/utils/valid-cnpj'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { ShieldQuestion } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DeleteUserModal } from '@/components/DeleteUserModal'

const registerFormSchema = z.object({
  ip: z.string().min(1, { message: 'Informe o IP' }),
  path: z.string().min(1, { message: 'Informe o caminho' }),
  user_firebird: z.string(),
  firebird_password: z.string(),
  name: z.string().min(1, { message: 'Informe a razão social' }),
  cnpj: z.string().refine((value) => isValidCNPJ(value), {
    message: 'Informe um CNPJ válido',
  }),
  email: z
    .string()
    .min(1, { message: 'Informe o email' })
    .email({ message: 'Informe um email válido' }),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .refine(
      (value) => /\d/.test(value),
      'Senha deve conter pelo menos um número',
    )
    .refine(
      (value) => /[a-zA-Z]/.test(value),
      'Senha deve conter pelo menos uma letra',
    )
    .refine(
      (value) => /[^a-zA-Z0-9]/.test(value),
      'Senha deve conter pelo menos um caractere especial',
    ),
  confirmPassword: z.string().min(1, { message: 'Confirme a senha' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function CreateUser() {
  const [modalOpen, setModalOpen] = useState(false)

  const token = Cookies.get('auth_token')
  const router = useRouter()

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = registerForm

  async function onSubmit({
    cnpj,
    confirmPassword,
    email,
    ip,
    name,
    password,
    path,
    firebird_password,
    user_firebird
  }: RegisterFormData) {
    if (password !== confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    try {
      await api.post('/register', {
        email,
        password,
        confirm_password: confirmPassword,
        database_path: path,
        database_ip: ip,
        name,
        cnpj,
        user_firebird,
        firebird_password
      })

      toast.success('Usuário criado com sucesso')

      reset()
    } catch {
      toast.error('Não foi possível criar o usuário')
    }
  }

  async function onUpdate({ cnpj, email, ip, name, path,firebird_password, user_firebird }: RegisterFormData) {
    try {
      await api.post('/update', {
        email,
        database_path: path,
        database_ip: ip,
        name,
        cnpj,
        id: userId,
        user_firebird,
        firebird_password
      })

      toast.success('Usuário atualizado com sucesso')

      reset()
      router.push('/dashboard')
    } catch {
      toast.error('Não foi possível atualizar o usuário')
    }
  }

  // Caso esteja sendo feita a edição de algum usuário
  const searchParams = useSearchParams()

  const userId = searchParams.get('id')

  useEffect(() => {
    if (userId) {
      const getUser = async () => {
        try {
          const response = await api.get('/get-all-users', {
            params: {
              user_id: userId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const {
            name,
            firebird_path_database: firebirdPathDatabase,
            email,
            database_ip: databaseIp,
            cnpj,
            firebird_user,
            firebird_password
          } = response.data

          setValue('ip', databaseIp)
          setValue('path', firebirdPathDatabase)
          setValue('cnpj', cnpj)
          setValue('name', name)
          setValue('email', email)
          setValue('password', 'QWER1234@')
          setValue('confirmPassword', 'QWER1234@')
          setValue('user_firebird', firebird_user)
          setValue('firebird_password', firebird_password)
        } catch {
          toast.error('Erro ao buscar usuário')
        }
      }

      getUser()
    }
  }, [setValue, token, userId])

  function handleOpenModal() {
    setModalOpen(!modalOpen)
  }

  async function handleDelete() {
    try {
      await api.delete('/delete', {
        data: {
          id: userId,
        },
      })

      toast.success('Usuário excluído com sucesso')

      router.push('/dashboard')
    } catch {
      toast.error('Não foi possível excluir o usuário')
    }
  }

  return (
    <>
      <Toaster />
      <div className="isolate bg-white px-6 py-20 sm:py-28 lg:px-8">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80d7f1] to-[#117efc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {userId ? 'Editar' : 'Criar'} usuário Dashboard
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Preencha todos as informações do formulário
          </p>
        </div>
        <form
          action="#"
          method="POST"
          className="mx-auto mt-16 max-w-xl sm:mt-20"
          onSubmit={handleSubmit(!userId ? onSubmit : onUpdate)}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                IP Externo
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  id="first-name"
                  placeholder="000.00.00.000"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('ip')}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Caminho
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  id="last-name"
                  placeholder="C:/ADMERP/DADOS.FDB"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('path')}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Usuário firebird <span className='text-gray-400 text-xs ml-1'>padrão (SYSDBA)</span>
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  id="first-name"
                  placeholder="000.00.00.000"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('user_firebird')}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Senha firebird <span className='text-gray-400 text-xs ml-1'> padrão (masterkey)</span>
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  id="last-name"
                  placeholder="C:/ADMERP/DADOS.FDB"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('firebird_password')}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Razão Social
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  id="company"
                  placeholder="ADM Informárica"
                  autoComplete="organization"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('name')}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                CNPJ
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  id="email"
                  placeholder="00.000.000/0000-00"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('cnpj')}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="phone-number"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  id="phone-number"
                  placeholder="user@mail.com"
                  autoComplete="tel"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('email')}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Senha
                </label>
                <ShieldQuestion
                  width={16}
                  height={16}
                  className="text-blue-400 cursor-pointer"
                  data-tooltip-id="password"
                />
                <ReactTooltip id="password" place="bottom">
                  <ToolTipContent />
                </ReactTooltip>
              </div>
              <div className="mt-2.5 gap-4">
                <input
                  type="password"
                  id="password"
                  placeholder="******"
                  autoComplete="given-name"
                  disabled={!!userId}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('password')}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Confirme a senha
              </label>
              <div className="mt-2.5">
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="******"
                  autoComplete="family-name"
                  disabled={!!userId}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  {...register('confirmPassword')}
                />
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isSubmitting
                ? 'Carregando...'
                : userId
                  ? 'Atualizar'
                  : 'Cadastrar'}
            </button>
            <div className="flex justify-around w-full">
              <Link
                href="/dashboard"
                className="font-semibold text-xs leading-6 text-blue-600 hover:text-blue-500 mt-2"
              >
                Voltar para o painel
              </Link>

              {userId && (
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="font-semibold text-xs leading-6 text-red-600 hover:text-red-500 mt-2"
                >
                  Excluir usuário
                </button>
              )}
            </div>
          </div>
        </form>
        {modalOpen && (
          <DeleteUserModal onClose={handleOpenModal} onDelete={handleDelete} />
        )}
      </div>
    </>
  )
}

const ToolTipContent = () => {
  return (
    <div className="flex flex-col">
      <p>A senha deve conter ao menos:</p>
      <p>8 caracteres</p>
      <p>1 caractere especial</p>
      <p>1 número</p>
      <p>1 letra</p>
    </div>
  )
}
