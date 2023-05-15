import ConvertKitForm from 'convertkit-react/bin/convertkit-react.esm'

const CK_FORM_ID = Number(process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM)

type SubscribeToConvertkitFormProps = {
  className?: string
}

const SubscribeToConvertkitForm: React.FC<SubscribeToConvertkitFormProps> = ({
  className = 'w-full',
}) => {
  return (
    <div id="convertkit-form" className={className}>
      <ConvertKitForm formId={CK_FORM_ID} />
    </div>
  )
}

export default SubscribeToConvertkitForm
