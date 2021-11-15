import {
  AVAX_PROVIDER_URL,
  BSC_PROVIDER_URL,
  FANTOM_PROVIDER_URL,
  HECO_PROVIDER_URL,
  MAINNET_INFURA_URL,
  POLYGON_PROVIDER_URL,
  XDAI_PROVIDER_URL,
  OKEX_PROVIDER_URL
} from '~/web3/constants'
import { ChainTypes } from '~/components/utils'

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

export type RelayToken = {
  type: ChainTypes
  relayTokenIndex: number
  chain: Chains
  img: string
  title: string
  decimals: number
}
const MATIC = {
  type: ChainTypes.Evm, // Добавить тип для всех чейнов
  relayTokenIndex: 1,
  chain: Chains.Pol,
  img: require('~/assets/img/icons/matic.svg'),
  title: 'MATIC',
  decimals: 18,
}
const FTM = {
  type: ChainTypes.Evm,
  relayTokenIndex: 2,
  chain: Chains.Ftm,
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
  relayTokenIndex: 8,
  chain: Chains.Okex,
  img: require('~/assets/img/icons/okex.svg'),
  title: 'OKT',
  decimals: 18,
}
export const originTokens: RelayToken[] = [MATIC, FTM, BNB, ETH, XDAI, OKT]

export const destinationTokens: RelayToken[] = [MATIC, FTM, BNB, XDAI, OKT]

export const tokens = {
  [Chains.Avax]: AVAX,
  [Chains.Eth]: ETH,
  [Chains.Ftm]: FTM,
  [Chains.Bsc]: BNB,
  [Chains.Pol]: MATIC,
  [Chains.Heco]: HT,
  // [Chains.Sol]: SOL,
  [Chains.Xdai]: XDAI,
  [Chains.Okex]: OKT,
}

export type ChainMap = {
  [key in Chains]: string
}

type ExplorerApiData = {
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
  [Chains.Okex]: 'https://www.oklink.com/okexchain',
}
export const chainProviderUrls: ExplorerApiData = {
  [Chains.Pol]: POLYGON_PROVIDER_URL,
  [Chains.Ftm]: FANTOM_PROVIDER_URL,
  [Chains.Bsc]: BSC_PROVIDER_URL,
  [Chains.Xdai]: XDAI_PROVIDER_URL,
  [Chains.Eth]: MAINNET_INFURA_URL,
  [Chains.Heco]: HECO_PROVIDER_URL,
  [Chains.Avax]: OKEX_PROVIDER_URL,
  [Chains.Okex]: AVAX_PROVIDER_URL,
}
