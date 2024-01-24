'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Toaster, toast } from 'react-hot-toast'
import { api } from '../lib/initAxios'
import { useRouter } from 'next/navigation'
import Cookie from 'js-cookie'

const loginFormSchema = z.object({
  email: z.string().min(1, { message: 'Informe seu email' }),
  password: z.string().min(1, { message: 'Informe sua senha' }),
})

type LoginFormData = z.infer<typeof loginFormSchema>

export default function App() {
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = loginForm

  const router = useRouter()

  async function onSubmit(data: LoginFormData) {
    const { email, password } = data

    try {
      const response = await api.post('/internal-login', {
        email,
        password,
      })

      const { token } = response.data

      Cookie.set('auth_token', token)
      router.push('/dashboard')
      toast.success('Bem vindo!')
    } catch {
      toast.error('Não foi possível realizar login')
    }
  }

  return (
    <>
      <Toaster />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <Image
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
            width={100}
            height={100}
          /> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Acessar Sistema
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-blue-500 sm:text-sm sm:leading-6"
                  {...register('email')}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Senha
                </label>
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-blue-500 sm:text-sm sm:leading-6"
                  {...register('password')}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Entrar'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Conheça nossas soluções!{' '}
            <a
              href="https://web.adminfo.com.br/"
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
            >
              Acesse nosso site
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
