import { Chains } from '~/components/constants'
import { TokenAmount } from '~/utils/safe-math'

export type Transaction = {
  id: number
  firstTxnHash: string | null
  secondTxnHash: string | null
  lastBalance: number
  fromAddress: string;
  toAddress: string;
  amountFrom: TokenAmount;
  amountTo: TokenAmount;
  lastBlock: number //might not necessary
  chainFrom: Chains
  chainTo: Chains
}
