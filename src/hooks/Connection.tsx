/* eslint-disable @typescript-eslint/no-floating-promises */
import { Connection, Keypair } from '@solana/web3.js'
import React, { createContext, FC, useContext, useEffect, useMemo } from 'react'

const DEFAULT_URL = 'http://127.0.0.1:8899'

const ConnectionContext = createContext({
  connection: new Connection(DEFAULT_URL, 'recent'),
})

export const useConnection = () => {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error('Wrap inside ConnectionProvider')
  }

  return context
}

export const ConnectionProvider: FC<{ url?: string }> = (props) => {
  const { children, url = DEFAULT_URL } = props
  const connection = useMemo(() => new Connection(url, 'recent'), [url])

  useEffect(() => {
    const accId = connection.onAccountChange(new Keypair().publicKey, () => {})
    const sId = connection.onSlotChange(() => undefined)

    return () => {
      connection.removeAccountChangeListener(accId)
      connection.removeSlotChangeListener(sId)
    }
  }, [connection])

  return (
    <ConnectionContext.Provider value={{ connection }}>
      {children}
    </ConnectionContext.Provider>
  )
}
