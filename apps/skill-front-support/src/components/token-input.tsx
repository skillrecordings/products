import * as React from 'react'

const TokenInput = () => {
  const [token, setToken] = React.useState<any>('')
  const [tokenStored, setTokenStored] = React.useState<boolean>(false)
  const handleSubmit = (e: any) => {
    e.preventDefault()
    localStorage.setItem('userToken', token)
    setTokenStored(true)
  }
  React.useEffect(() => {
    if (localStorage.getItem('userToken')) {
      setTokenStored(true)
      setToken(localStorage.getItem('userToken'))
    }
  }, [tokenStored])
  return (
    <div className="border-t border-gray-300 w-full py-2">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between flex-wrap items-end"
      >
        <div className="flex-grow">
          <label
            htmlFor="userToken"
            className="block text-sm font-medium text-gray-700"
          >
            Token
            <input
              type="text"
              name="userToken"
              value={token}
              disabled={tokenStored}
              onChange={(e) => setToken(e.target.value)}
              className={`border shadow-sm focus:ring-indigo-500 outline-none 
                focus:border-indigo-500 block w-full sm:text-sm rounded-md mt-1 p-0.5 mb-1
                ${tokenStored ? 'border-pink-500' : 'border-gray-300'}`}
            />
          </label>
        </div>
        <div>
          {tokenStored ? (
            <button
              onClick={() => {
                localStorage.removeItem('userToken')
                setTokenStored(false)
                setToken('')
              }}
              className="bg-gray-200 pl-2 pr-2 pt-px pb-px rounded text-sm hover:bg-gray-300 cursor-pointer mb-1 ml-2"
            >
              Clear Token
            </button>
          ) : (
            <input
              type="submit"
              className="bg-gray-200 pl-2 pr-2 pt-px pb-px rounded text-sm hover:bg-gray-300 cursor-pointer mb-1 ml-2"
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default TokenInput
