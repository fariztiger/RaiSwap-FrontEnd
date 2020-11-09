import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Rai } from '../../rai'

export interface SushiContext {
  rai?: typeof Rai
}

export const Context = createContext<SushiContext>({
  rai: undefined,
})

declare global {
  interface Window {
    raisauce: any
  }
}

const RaiProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [rai, setRai] = useState<any>()

  // @ts-ignore
  window.rai = rai
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const raiLib = new Rai(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setRai(raiLib)
      window.raisauce = raiLib
    }
  }, [ethereum])

  return <Context.Provider value={{ rai }}>{children}</Context.Provider>
}

export default RaiProvider
