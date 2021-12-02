import { Chains, RelayToken, FTM, CELT } from '~/components/constants'

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
  tokenFrom: FTM,
  tokenTo: CELT,
  lastBalance: 0,
  lastBlock: 0, //might not necessary
  chainFrom:  Chains.Okex,
  chainTo: Chains.Ftm,
  fromAddress: "",
  toAddress: "",
  amountFrom: 0,
  amountTo: 0,
  gtonAmount: null
}