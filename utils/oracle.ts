import { Chains } from '~/components/constants'
import logger from './logger'

const baseCache = 'https://cache.api.graviton.one/'
const baseUrl = 'https://proxy.ogswap.one'
export const coingeckoApi = 'https://api.coingecko.com/api/v3/'

export async function setUpcomingTxn(userEventDataAccount: string) {
  const res = await fetch(baseUrl + '/insert?accountId=' + userEventDataAccount)
}

export async function sendDataToOracle(
  txn: string,
  from: number
): Promise<string | null> {
  try {
    const res = await fetch(baseCache + 'provisor/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        txn,
        chain_type: 0,
        chain_id: from,
      }),
    })
    const body = await res.json()
    return body.txn
  } catch (e) {
    logger(e)
    return null
  }
}

export const tokenPrices = {
  [Chains.Eth]: 'ethereum',
  [Chains.Ftm]: 'fantom',
  [Chains.Bsc]: 'binancecoin',
  [Chains.Pol]: 'matic-network',
  [Chains.Heco]: 'huobi-token',
  [Chains.Xdai]: 'xdai',
  [Chains.Avax]: 'avalanche-2',
  [Chains.Okex]: 'oec-token',
}

export async function getTokenById(tokenName: string): Promise<number> {
  let url = coingeckoApi + 'coins/' + tokenName
  let res = await fetch(url)
  let body = await res.json()
  return body.market_data.current_price.usd
}
