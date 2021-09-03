import { Connection } from '@solana/web3.js'

export async function getErrorForTransaction(
  connection: Connection,
  txid: string
) {
  const tx = await connection.getParsedConfirmedTransaction(txid, 'confirmed')

  const errors: string[] = []
  if (tx?.meta && tx.meta.logMessages) {
    console.log(tx.meta.logMessages)
    for (const log of tx.meta.logMessages) {
      if (log.includes('already in use')) {
        errors.push('Account already in use!')
      }

      const regex = /Error: (.*)/gm
      let m
      while ((m = regex.exec(log)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        if (m.length > 1) {
          errors.push(m[1])
        }
      }
    }
  }

  return errors
}
