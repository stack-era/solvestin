import { BaseSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { useConnection } from './Connection'
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { lamportsToSol } from '../solana/utils/lamportsToSol'

type WalletContextType = {
  walletPK?: string
  balance: number
  wallet: BaseSignerWalletAdapter | null
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  fetchSolBalance: () => void
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  wallet: null,
  balance: 0,
  connect: async () => {},
  disconnect: async () => {},
  fetchSolBalance: () => {},
})

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('Wrap with WalletProvider')
  }

  return context
}

export const WalletProvider: FC = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [wallet, setWallet] = useState<BaseSignerWalletAdapter | null>(null)
  const [walletPK, setWalletPK] = useState<string>()
  const [balance, setBalance] = useState(0)

  const { connection } = useConnection()

  const connect = useCallback(async () => wallet?.connect(), [wallet])
  const disconnect = useCallback(async () => wallet?.disconnect(), [wallet])

  const fetchSolBalance = useCallback(() => {
    if (wallet?.publicKey) {
      connection
        .getBalance(wallet.publicKey)
        .then((balance = 0) => setBalance(lamportsToSol(balance)))
        .catch((error) => {
          // use toast message to show error
          // throw new Error(error.message) // comment this line if you are showing toast message
        })
    }
  }, [connection, wallet?.publicKey])

  useEffect(() => {
    fetchSolBalance()
  }, [fetchSolBalance])

  useEffect(() => {
    const wallet = new PhantomWalletAdapter()
    setWallet(wallet)

    wallet.on('connect', () => {
      setConnected(true)
      setWalletPK(wallet.publicKey?.toString())
    })

    wallet.on('disconnect', () => {
      setConnected(false)
      setWalletPK(undefined)
    })
  }, [])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletPK,
        connected,
        connect,
        disconnect,
        balance,
        fetchSolBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
