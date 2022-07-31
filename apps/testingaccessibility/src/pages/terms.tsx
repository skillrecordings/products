import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '@skillrecordings/honeycomb-tracer'

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
