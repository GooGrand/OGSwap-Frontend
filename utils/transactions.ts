import { Token } from '~/plugins/api'
import { Chains } from '~/components/constants'

export type Transaction = {
  id: number
  firstTxnHash: string | null
  secondTxnHash: string | null
  lastBalance: number
  fromAddress: string;
  toAddress: string;
  amountFrom: string;
  tokenFrom: Token
  tokenTo: Token
  amountTo: string;
  lastBlock: number
  chainFrom: Chains
  chainTo: Chains
}

export const token = { 
  "chain_meta": { 
    "chain_icon": "/img/gton/table-images/chain/polygon.svg", 
    "chain_id": 137, 
    "chain_name": "Polygon", 
    "img": "/img/relaySwap/chains/polygon.svg", 
    "search": "maticpolygon", 
    "small_img": "/img/farm/farm-elem/polygon-chain.svg", 
    "tvl_img": "/img/farm/liquidity-chart/polygon.svg" 
  }, 
  "chain_name": "PLG", 
  "explorer_url": "https://polygonscan.com/", 
  "gton_address": "0xf480f38c366daac4305dc484b2ad7a496ff00cea", 
  "pool_meta": { 
    "pair_icon": "/img/gton/table-images/pairs/gton-usdc.svg", 
    "token_pair_name": "USDC"
   }, 
   "reserve_a": "24129869633", 
   "reserve_b": "12544241685814833530132", 
   "rpc_url": "https://rpc-mainnet.maticvigil.com/", 
   "token_a_address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", 
   "token_address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", 
   "token_b_address": "0xf480f38c366daac4305dc484b2ad7a496ff00cea", 
   "token_meta": {}, 
   "tvl": 46413.69423751489 }

export const emptyPreview = {
  id: 0,
  firstTxnHash: null,
  secondTxnHash: null,
  tokenFrom: token,
  tokenTo: token,
  lastBalance: 0,
  lastBlock: 0,
  chainFrom: Chains.Okex,
  chainTo: Chains.Ftm,
  fromAddress: "",
  toAddress: "",
  amountFrom: 0,
  amountTo: 0,
  gtonAmount: null
}