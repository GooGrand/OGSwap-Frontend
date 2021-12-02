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
