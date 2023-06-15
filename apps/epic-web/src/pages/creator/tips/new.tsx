import React from 'react'
import CreateTipForm from 'module-builder/create-tip-form'
import TipCreatorLayout from 'module-builder/tip-creator-layout'

const NewTip = () => {
  return (
    <TipCreatorLayout>
      <header>
        <h1 className="text-4xl font-bold">
          Upload Your Video Create a New Tip
        </h1>
      </header>
      <main className="pt-8">
        <p className="pb-3">
          When your video upload has been completed you will be able to addd a
          tile and additional details to your tip.
        </p>
        <CreateTipForm />
      </main>
    </TipCreatorLayout>
  )
}

NewTip.theme = 'light'

export default NewTip
