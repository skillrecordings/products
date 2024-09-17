import React from 'react'
import Layout from '@/components/layout'
import ContactForm from '@/components/contact/contact-form'

const ContactPage = () => {
  return (
    <Layout
      meta={{
        title: 'Contact',
      }}
    >
      <header className="mx-auto w-full max-w-screen-md px-5 py-16 text-center text-2xl font-bold">
        <h1>Contact Epic React</h1>
      </header>
      <main className="mx-auto flex w-full max-w-lg items-center justify-center px-5 pb-16">
        <ContactForm />
      </main>
    </Layout>
  )
}

export default ContactPage
