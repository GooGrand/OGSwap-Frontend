import { Chains, RelayToken } from '~/components/constants'
import { TokenAmount } from '~/utils/safe-math'

export type Transaction = {
  id: number
  firstTxnHash: string | null
  secondTxnHash: string | null
  lastBalance: number
  fromAddress: string;
  toAddress: string;
  amountFrom: string;
  tokenFrom: RelayToken
  tokenTo: RelayToken
  amountTo: string;
  lastBlock: number //might not necessary
  chainFrom: Chains
  chainTo: Chains
}

export const emptyPreview = {
  id: 0,
  firstTxnHash: null,
  secondTxnHash: null,
  lastBalance: 0,
  lastBlock: 0, //might not necessary
  chainFrom:  Chains.Eth,
  chainTo: Chains.Ftm,
  fromAddress: "",
  toAddress: "",
  amountFrom: 0,
  amountTo: 0,
  gtonAmount: null
}