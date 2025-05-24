import React, { useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'

export const InputFunds = () => {
  const [amount, setAmount] = useState('')

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return
    alert(`Thank you! You pledged $${amount} to support vote integrity.`)
  }

  return (
    <div className="max-w-md mt-8 space-y-4">
      <h3 className="text-xl font-semibold">Ready to fund your guarantee?</h3>
      <p className="text-gray-700">
        Enter the amount you&apos;d like to commit toward this election&apos;s Vote Integrity Guarantee.
      </p>
      <div className="flex items-center gap-2">
        <span className="text-2xl text-gray-600">$</span>
        <input
          className="w-40 px-3 py-4 text-2xl text-right border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          inputMode="decimal"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50.00"
          type="number"
          value={amount}
        />
        <OnClickButton onClick={handleSubmit}>Submit Pledge</OnClickButton>
      </div>
    </div>
  )
}
