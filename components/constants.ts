import { ChainTypes } from '~/components/utils'
export const FANTOM_PROVIDER_URL = 'https://rpc.ftm.tools'
export const OKEX_PROVIDER_URL = 'https://exchainrpc.okex.org'

// при изменении сломается только механика получения чейн айди от провайдера
export enum Chains { // Надо заменить айдишники на названия по типу и добавить солану
  Eth = '1', // eth
  Bsc = '56', // bsc
  Ftm = '250', // ftm
  Xdai = '100',
  Heco = '128',
  Avax = '43114',
  Pol = '137',
  // Sol = '-1',
  Okex = '66',
}

export const chainToTokenName: { [key in Chains]: string } = {
  [Chains.Eth]: 'ETH',
  [Chains.Pol]: 'MATIC',
  [Chains.Ftm]: 'FTM',
  [Chains.Bsc]: 'BNB',
  [Chains.Heco]: 'HT',
  [Chains.Xdai]: 'XDAI',
  // [Chains.Sol]: 'SOL',
  [Chains.Avax]: 'AVAX',
  [Chains.Okex]: 'OKT',
}

export const limits: Record<string, number> = {
  [Chains.Eth]: 0.03, //30000000000000000
  [Chains.Ftm]: 21.79, //21791995200000000000
  [Chains.Bsc]: 0.02, //20643500000000000
  [Chains.Pol]: 7.02, //7028815300000000000
  [Chains.Heco]: 0.74, // 747630800000000000
  [Chains.Xdai]: 10.0, //10002986200000000000
  [Chains.Avax]: 0.22, //224775200000000000
  // [Chains.Sol]: 0.62, // Will add limit for solana?
}

export const logos: { [key in Chains]: string } = {
  [Chains.Ftm]: require('~/assets/img/logotypes/fantom.svg'),
  [Chains.Bsc]: require('~/assets/img/logotypes/binance.svg'),
  [Chains.Pol]: require('~/assets/img/logotypes/matic.svg'),
  [Chains.Eth]: require('~/assets/img/logotypes/ethereum.svg'),
  [Chains.Xdai]: require('~/assets/img/logotypes/xdai.svg'),
  [Chains.Xdai]: require('~/assets/img/logotypes/xdai.svg'),
  [Chains.Heco]: require('~/assets/img/logotypes/huobi.svg'),
  [Chains.Avax]: require('~/assets/img/logotypes/huobi.svg'),
  [Chains.Okex]: require('~/assets/img/logotypes/okexchain.svg'),
  // [Chains.Sol]: require('~/assets/img/logotypes/solana.svg'),
}

export const logosUrls: { [key in Chains]: string } = {
  [Chains.Ftm]: '~/assets/img/logotypes/fantom.svg',
  [Chains.Bsc]: '~/assets/img/logotypes/binance.svg',
  [Chains.Eth]: '~/assets/img/logotypes/ethereum.svg',
  [Chains.Pol]: '~/assets/img/logotypes/matic.svg',
  [Chains.Xdai]: '~/assets/img/logotypes/xdai.svg',
  [Chains.Heco]: '~/assets/img/logotypes/huobi.svg',
  [Chains.Avax]: '~/assets/img/logotypes/huobi.svg',
  [Chains.Okex]: '~/assets/img/logotypes/okex.png',
  // [Chains.Sol]: '~/assets/img/logotypes/solana.svg',
}

interface Status {
  id: number
  visible: boolean
  text: string
}

export const statusList: Array<Status> = [
  {
    id: 0,
    visible: false,
    text: 'Deposit transaction is',
  },
  {
    id: 2,
    visible: false,
    text: 'Swap transaction is',
  },
]
// interface Token {
//   type: ChainTypes
//   relayTokenIndex: number
//   img: string
//   title: string
//   decimals: number
// }

// export interface NativeToken extends Token {
//   chain: Chains
// }

// export interface ERC20Token extends Token {
//   // a map of available token addresses
//   chains: { [key in Chains]?: string}
// }

// export type RelayToken = NativeToken | ERC20Token
export type RelayToken = {
  type: ChainTypes
  relayTokenIndex: number
  chain: Chains
  native: boolean
  address: string
  img: string
  title: string
  decimals: number
}
export const CELT = {
  type: ChainTypes.Evm,
  coingeckoId: "celestial",
  relayTokenIndex: 0,
  address: "0x5ab622494ab7c5e81911558c9552dbd517f403fb",
  rpc_url: OKEX_PROVIDER_URL,
  native: false,
  chain: Chains.Okex,
  img: require('~/assets/img/icons/celt.jpg'),
  title: 'CELT',
  decimals: 18,
}
const MATIC = {
  type: ChainTypes.Evm, 
  relayTokenIndex: 1,
  chain: Chains.Pol,
  img: require('~/assets/img/icons/matic.svg'),
  title: 'MATIC',
  decimals: 18,
}
const FTM = {
  type: ChainTypes.Evm,
  coingeckoId: "fantom",
  relayTokenIndex: 2,
  native: true,
  rpc_url: FANTOM_PROVIDER_URL,
  chain: Chains.Ftm,
  address: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  img: require('~/assets/img/icons/ftm.svg'),
  title: 'FTM',
  decimals: 18,
}
const BNB = {
  type: ChainTypes.Evm,
  relayTokenIndex: 3,
  chain: Chains.Bsc,
  img: require('~/assets/img/icons/bsc.svg'),
  title: 'BNB',
  decimals: 18,
}
const ETH = {
  type: ChainTypes.Evm,
  relayTokenIndex: 4,
  chain: Chains.Eth,
  img: require('~/assets/img/icons/ethereum.svg'),
  title: 'ETH',
  decimals: 18,
}
const XDAI = {
  type: ChainTypes.Evm,
  relayTokenIndex: 5,
  chain: Chains.Xdai,
  img: require('~/assets/img/icons/xdai.svg'),
  title: 'XDAI',
  decimals: 18,
}
// const SOL = {
//   type: ChainTypes.Solana,
//   relayTokenIndex: 7,
//   chain: Chains.Sol,
//   img: require('~/assets/img/icons/sol.svg'),
//   title: 'SOL',
//   decimals: 9,
// }
const HT = {
  type: ChainTypes.Evm,
  relayTokenIndex: 6,
  chain: Chains.Heco,
  img: require('~/assets/img/icons/heco.svg'),
  title: 'HT',
  decimals: 18,
}
const AVAX = {
  type: ChainTypes.Evm,
  relayTokenIndex: 7,
  chain: Chains.Avax,
  img: '~/assets/img/icons/avax.svg',
  title: 'AVAX',
  decimals: 18,
}
const OKT = {
  type: ChainTypes.Evm,
  coingeckoId: "oec-token",
  relayTokenIndex: 8,
  native: true,
  rpc_url: OKEX_PROVIDER_URL,
  chain: Chains.Okex,
  address: "0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15",
  img: require('~/assets/img/icons/okex.svg'),
  title: 'OKT',
  decimals: 18,
}
export const originTokens: RelayToken[] = [FTM,OKT, CELT]

export const destinationTokens: RelayToken[] = [FTM, OKT, CELT]

export const tokens = {
  [Chains.Ftm]: FTM,
  // [Chains.Sol]: SOL,
  [Chains.Okex]: OKT,
  [CELT.address]: CELT
}

export const tokensArray = [FTM, OKT, CELT]

export type ChainMap = {
  [key in Chains]: string
}

export const chainToName: ChainMap = {
  [Chains.Pol]: 'PLG',
  [Chains.Ftm]: 'FTM',
  [Chains.Bsc]: 'BSC',
  [Chains.Eth]: 'ETH',
  [Chains.Xdai]: 'DAI',
  [Chains.Heco]: 'HEC',
  [Chains.Avax]: 'AVA',
  [Chains.Okex]: 'OKT',
}

export const explorers: ChainMap = {
  [Chains.Pol]: 'https://polygonscan.com/tx/',
  [Chains.Ftm]: 'https://ftmscan.com/tx/',
  [Chains.Bsc]: 'https://bscscan.com/tx/',
  [Chains.Eth]: 'https://etherscan.io/tx/',
  [Chains.Avax]: 'https://cchain.explorer.avax.network/tx/',
  [Chains.Xdai]: 'https://blockscout.com/xdai/mainnet/tx/',
  [Chains.Heco]: 'https://hecoinfo.com/tx/',
  [Chains.Okex]: 'https://www.oklink.com/okexchain/tx/',
}
