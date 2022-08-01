import {GetServerSideProps} from 'next'
import {tracer} from '@skillrecordings/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {res, req} = context
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  return {
    redirect: {
      destination: '/privacy',
      permanent: true,
    },
  }
}

// Default export to prevent next.js errors
export default function TermsPage() {}
