import {useConvertkit} from '@skillrecordings/convertkit'
import * as React from 'react'

const SubscribeForm: React.FC<
  React.PropsWithChildren<{onSubmit?: () => void; className?: string}>
> = ({
  onSubmit,
  className = 'relative py-16 lg:py-40 xl:py-48 md:py-32 sm:py-24',
}) => {
  const {subscriber} = useConvertkit()
  return !subscriber ? (
    <div id="subscribe" className={className}>
      <h1 className="pb-4 mx-auto text-xl sm:text-2xl md:text-3xl font-fibra">
        Mejora tus Habilidades con <strong>Contenido Profesional</strong> de
        Ingeniería de Front-End
      </h1>
      <h4 className="text-base opacity-75 md:text-lg">
        Suscribete para enterarte de los nuevos cursos, artículos, y eventos de
        Escuela Frontend!
      </h4>
      <form
        className="grid w-full grid-cols-1 gap-8 py-8 mx-auto"
        action={`https://app.convertkit.com/forms/${process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM}/subscriptions`}
        method="post"
      >
        <div className="flex flex-col">
          <input
            className="px-4 py-3 text-lg bg-gray-100 border-none dark:bg-gray-900 rounded-xl form-input"
            id="fields[first_name]"
            name="fields[first_name]"
            type="text"
            placeholder="Tu nombre"
          />
        </div>
        <div className="flex flex-col">
          <input
            className="px-4 py-3 text-lg bg-gray-100 border-none dark:bg-gray-900 rounded-xl form-input "
            id="email_address"
            name="email_address"
            type="email"
            placeholder="Tu correo electrónico"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-4 text-lg font-semibold text-center text-white transition-all duration-200 ease-in-out transform bg-blue-600 group hover:shadow-xl rounded-xl hover:bg-blue-700 hover:-translate-y-1 hover:scale-105"
          onClick={() => {
            onSubmit && onSubmit()
          }}
        >
          <span className="text-base sm:text-xl">Suscríbete</span>
        </button>
      </form>
      <div className="mt-2 text-sm text-center opacity-60">
        Sin spam, cancele en cualquier momento.
      </div>
    </div>
  ) : null
}

export default SubscribeForm
