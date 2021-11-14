import RelayContract from './abi/relay_contract.json'
import ERC20ABI from './abi/erc20.json'
import LpContractV2 from './abi/lpContractv2.json'
import OgRouter from './abi/OgRouter.json'
import RelayProgram from './idl/relay.json'

export const contractsAddresses: Record<string, string> = {
  gtonEth: '0x01e0E2e61f554eCAaeC0cC933E739Ad90f24a86d',
  gtonFtm: '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4',
  gtonBsc: '0x64D5BaF5ac030e2b7c435aDD967f787ae94D0205',
  gtonPol: '0xf480f38c366daac4305dc484b2ad7a496ff00cea',
}
export const gtonAddressesArray = [
  '0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d', // eth
  '0x64D5BaF5ac030e2b7c435aDD967f787ae94D0205', // bsc
  '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4', // ftm
  '0xf480f38c366daac4305dc484b2ad7a496ff00cea', // pol
]

export const relayAddresses: Record<string, string> = {
  '137': '0x308dc032417bb4b9a79606a6c61fce3c375cf6d5',
  '250': '0x48eded8ec5c52308011f191600c0e1ae60f49be6',
  '56': '0xde87ca6b2e0ff2913f2bc14232aaf400fc3826d3',
  '1': '0x53dd6d712ad1b7613bca7cf7f34e436f75729dd9',
  '128': '0xf9cdabb96cffdd53817aea813273cbe8c39b328e',
  '43114': '0xf9cdabb96cffdd53817aea813273cbe8c39b328e',
  '100': '0xbba98ea00ab995a467e9afabbb15dbddd29e1f44',
}

export const routerAddresses: Record<string, string> = {
  "250": "0x577ee80a81ee9670B64614e5D5BE5cB21350eB38",
  "66": "0x577ee80a81ee9670B64614e5D5BE5cB21350eB38",
}

export const wrappedNatives: Record<string, string> = {
  "250": "21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  "66": "8f8526dbfd6e38e3d8307702ca8469bae6c56c15",
}

export enum ProvidersUrl {
  // FANTOM_PROVIDER_URL = 'https://rpc.ftm.tools',
  FANTOM_PROVIDER_URL = 'https://apis.ankr.com/c3f382db4c55497b81bf3feb1e9a8499/d37735e535d9d051230799cae45aeb6a/fantom/full/main',
  BSC_PROVIDER_URL = 'https://bsc-dataseed.binance.org',
  POLYGON_PROVIDER_URL = 'https://polygon-rpc.com/',
  HECO_PROVIDER_URL = 'https://http-mainnet.hecochain.com',
  AVAX_PROVIDER_URL = 'https://api.avax.network/ext/bc/C/rpc',
  XDAI_PROVIDER_URL = 'https://dai.poa.network',
  MAINNET_INFURA_URL = 'https://mainnet.infura.io/v3/ec6afadb1810471dbb600f24b86391d2',
}

export const FANTOM_PROVIDER_URL = 'https://rpc.ftm.tools'
export const BSC_PROVIDER_URL = 'https://bsc-dataseed.binance.org'
export const POLYGON_PROVIDER_URL =
  'https://polygon-rpc.com/'
export const HECO_PROVIDER_URL = 'https://http-mainnet.hecochain.com'
export const AVAX_PROVIDER_URL = 'https://api.avax.network/ext/bc/C/rpc'
export const XDAI_PROVIDER_URL = 'https://dai.poa.network'
export const OKEX_PROVIDER_URL = 'https://exchainrpc.okex.org'

export const MAINNET_INFURA_URL =
  'https://mainnet.infura.io/v3/ec6afadb1810471dbb600f24b86391d2'

export const defaultChain = { url: FANTOM_PROVIDER_URL, id: 250 }

export const contractsABI = {
  RelayContract,
  ERC20ABI,
  LpContractV2,
  OgRouter
}

export const programIdls = {
  RelayProgram,
}
