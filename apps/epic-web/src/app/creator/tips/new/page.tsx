import React from 'react'
import CreateTipForm from 'module-builder/create-tip-form'

const NewTip = () => {
  return (
    <>
      <header>
        <h1 className="text-4xl font-bold">Create a New Tip</h1>
      </header>
      <main className="pt-8">
        <CreateTipForm />
      </main>
    </>
  )
}

export default NewTip
