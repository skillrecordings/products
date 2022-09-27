import React from 'react'

const BuyMoreSeats = () => {
  const handleOnSubmit = () => {}
  const calculatedPrice = 0

  return (
    <form className="pt-3" onSubmit={handleOnSubmit}>
      <fieldset className="flex justify-between w-full items-center">
        <label className="inline-flex items-center gap-3">
          <span className="opacity-80">Seats</span>
          <input
            defaultValue={5}
            required={true}
            type="number"
            min={1}
            max={100}
            step={1}
            className="bg-gray-100 border border-gray-200 pl-3 py-2 rounded-md font-bold font-mono"
          />
        </label>
        <div className="flex items-center gap-5">
          <div aria-live="polite" className="text-lg font-medium">
            {'$' + calculatedPrice}
          </div>
          <button
            className="px-5 py-2 bg-green-500 rounded-md font-bold text-white"
            type="submit"
            disabled={false}
          >
            Buy
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default BuyMoreSeats
