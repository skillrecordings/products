import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'

const Login: React.FC<React.PropsWithChildren<{csrfToken: string}>> = ({
  csrfToken,
}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  return (
    <div>
      <div className="flex flex-col items-center justify-center flex-grow w-full p-5 pt-0 pb-16 mx-auto text-gray-900 dark:text-white md:pb-40 md:pt-16">
        <main className="rounded-lg sm:mx-auto">
          <div className="flex items-center justify-center w-full max-w-sm mx-auto"></div>
          <h1 className="pt-4 text-3xl font-bold leading-9 text-center font-heading">
            Iniciar Sesión en Escuela Frontend
          </h1>

          <div className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div>
              <form className="" method="post" action="/api/auth/signin/email">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-5"
                >
                  Email
                </label>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    required={true}
                    placeholder="Tu email"
                    className="block w-full py-3 pl-3 text-gray-900 placeholder-gray-400 bg-gray-200 border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-indigo-500 focus:border-blue-500"
                    {...register('email', {required: true})}
                  />
                </div>

                {errors?.email?.message && (
                  <p>{String(errors.email.message)}</p>
                )}

                <button className="w-full px-5 py-3 mt-2 font-medium text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800">
                  Envíame un correo
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}
