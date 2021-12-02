import { Plugin } from '@nuxt/types'
import logger from '~/utils/logger'

interface ChainMeta {
  "chain_icon": string
  "chain_id": number
  "chain_name": string
  "img": string
  "search": string
  "small_img": string
  "tvl_img": string
}

interface TokenMeta {
  native: boolean
  img: string
  decimals: number
}

interface PoolMeta {
  "pair_icon": string
  "token_pair_name": string
}

export interface Token {
  "chain_meta": ChainMeta
  "chain_name": string
  "explorer_url": string
  "gton_address": string
  "pool_meta": PoolMeta
  "reserve_a": string
  "reserve_b": string
  "rpc_url": string
  "token_a_address": string
  "token_address": string
  "token_b_address": string
  "token_meta": TokenMeta
  "tvl": number
}

interface ApiInterface {
  getTokens(chain: string | null): Promise<Token[]>
  sendTxnToProvisor(txn: string, from: number): Promise<string | null>
}
const baseCache = 'https://cache.api.graviton.one/'

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiInterface
  }
}

const api: ApiInterface = {
  async getTokens(chain: string | null): Promise<Token[]> {
    try {
      const res = await fetch(baseCache + "/apiv2/ogs/get_by_chain?chain_name="+chain);
      const arr = await res.json()
      return arr
    } catch (e) {
      logger(e)
      return [] as Token[]
    }

  },
  async sendTxnToProvisor(
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
}

const apiPlugin: Plugin = (_, inject) => {
  inject('api', api)
}

export default apiPlugin
