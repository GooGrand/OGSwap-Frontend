import { callContractProps, createInstance } from '~/web3/evm_utils'
import { EvmChains } from '~/components/utils'
import {
  ProvidersUrl,
  contractsABI,
  gtonAddressesArray,
} from '~/web3/constants'
import { AbiItem } from 'web3-utils'
import { TokenAmount } from '~/utils/safe-math'
import { Chains } from '~/components/constants'

type Pool = {
  chain: Chains
  provider: ProvidersUrl
  mainPoolContract: string
  stablePoolContract: string
  nativeTokenAddress: string
  stableDecimals: number
}
export const pools: Pool[] = [
  {
    chain: Chains.Eth,
    provider: ProvidersUrl.MAINNET_INFURA_URL,
    mainPoolContract: '0xba38eca6dfdb92ec605c4281c3944fccd9dec898',
    stablePoolContract: '0x06da0fd433c1a5d7a4faa01111c044910a184553',
    nativeTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    stableDecimals: 6
  },
  {
    chain: Chains.Ftm,
    provider: ProvidersUrl.FANTOM_PROVIDER_URL,
    mainPoolContract: '0x25f5b3840d414a21c4fc46d21699e54d48f75fdd',
    stablePoolContract: '0xe7e90f5a767406eff87fdad7eb07ef407922ec1d',
    nativeTokenAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    stableDecimals: 6 
  },
  {
    chain: Chains.Bsc,
    provider: ProvidersUrl.BSC_PROVIDER_URL,
    mainPoolContract: '0xa216571b69dd69600f50992f7c23b07b1980cfd8',
    stablePoolContract: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16',
    nativeTokenAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    stableDecimals: 18
  },
  {
    chain: Chains.Pol,
    provider: ProvidersUrl.POLYGON_PROVIDER_URL,
    mainPoolContract: '0x7d49d50c886882220c428afbe60408904c72e2df',
    stablePoolContract: '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827',
    nativeTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    stableDecimals: 18
  },
  // {
  //   provider: ProvidersUrl.HECO_PROVIDER_URL,
  //   mainPoolContract: "0xba38eca6dfdb92ec605c4281c3944fccd9dec898",
  //   stablePoolContract: "0xba38eca6dfdb92ec605c4281c3944fccd9dec898",
  // },
  // {
  //   provider: ProvidersUrl.XDAI_PROVIDER_URL,
  //   mainPoolContract: "0xba38eca6dfdb92ec605c4281c3944fccd9dec898",
  //   stablePoolContract: "0xba38eca6dfdb92ec605c4281c3944fccd9dec898",
  // },
]

export interface PriceData extends Reserves {
  dexNativePrice: string
}
export interface Reserves {
  gtonReserve: TokenAmount
  nativeReserve: TokenAmount
}

export async function getPoolReserves(
  provider: ProvidersUrl,
  contract: string
): Promise<Reserves> {
  const props = ['token0', 'getReserves']
  const web3 = createInstance(provider)
  const res = await callContractProps(
    web3,
    contract,
    contractsABI.LpContractV2 as AbiItem[],
    props
  )
  if (gtonAddressesArray.includes(String(res['token0']))) {
    return {
      //@ts-ignore
      gtonReserve: new TokenAmount(res['getReserves']['_reserve0'], 18),
      //@ts-ignore
      nativeReserve: new TokenAmount(res['getReserves']['_reserve1'], 18),
    }
  } else {
    return {
      //@ts-ignore
      gtonReserve: new TokenAmount(res['getReserves']['_reserve1'], 18),
      //@ts-ignore
      nativeReserve: new TokenAmount(res['getReserves']['_reserve0'], 18),
    }
  }
}

export async function getPoolStable(
  provider: ProvidersUrl,
  contract: string,
  nativeAddress: string,
  stableDecimals: number
): Promise<{nativeReserve: TokenAmount, stableReserve: TokenAmount}> {
  const props = ['token0', 'getReserves']
  const web3 = createInstance(provider)
  const res = await callContractProps(
    web3,
    contract,
    contractsABI.LpContractV2 as AbiItem[],
    props
  )
  if (String(res['token0']).toLowerCase() == nativeAddress.toLowerCase()) {
    return {
      //@ts-ignore
      nativeReserve: new TokenAmount(res['getReserves']['_reserve0'], 18),
      //@ts-ignore
      stableReserve: new TokenAmount(res['getReserves']['_reserve1'], stableDecimals),
    }
  } else {
    return {
      //@ts-ignore
      nativeReserve: new TokenAmount(res['getReserves']['_reserve1'], 18),
      //@ts-ignore
      stableReserve: new TokenAmount(res['getReserves']['_reserve0'], stableDecimals),
    }
  }
}

export function calculatePrice(stableReserves: TokenAmount, tokenReserves: TokenAmount): string {
  // the price in stable-token pool equals stableReserves / tokenReserves
  return stableReserves.toEther().dividedBy(tokenReserves.toEther()).toFixed(2)
}