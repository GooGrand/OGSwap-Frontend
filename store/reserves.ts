import _ from 'lodash'
import { EvmChains } from '~/components/utils'
import { GetterTree, ActionTree } from 'vuex'
import {
  PriceData,
  getPoolReserves,
  calculatePrice,
  getPoolStable,
  pools,
} from '~/utils/reserves'
import { Chains } from '~/components/constants'

type State = {
  prices: Prices
}
type Prices = {
  [key in Chains]: PriceData
}

export const state = () => {
  return {
    prices: {
      [Chains.Avax]: {} as PriceData,
      [Chains.Eth]: {} as PriceData,
      [Chains.Ftm]: {} as PriceData,
      [Chains.Bsc]: {} as PriceData,
      [Chains.Xdai]: {} as PriceData,
      [Chains.Heco]: {} as PriceData,
      [Chains.Pol]: {} as PriceData,
    },
  }
}

export const actions: ActionTree<State, any> = {
  async setReserves({ commit }) {
    for (const pool of pools) {
      const stablePool = await getPoolStable(
        pool.provider,
        pool.stablePoolContract,
        pool.nativeTokenAddress,
        pool.stableDecimals
      )
      const gtonPool = await getPoolReserves(
        pool.provider,
        pool.mainPoolContract
      )

      const price = calculatePrice(
        stablePool.stableReserve,
        stablePool.nativeReserve
      )
      commit('updatePrice', {
        chain: pool.chain,
        body: { ...gtonPool, dexNativePrice: price },
      })
    }
  },
}

export const mutations = {
  setPrices(state: State, body: Prices) {
    state.prices = _.cloneDeep(body) // I'am not sure this is necessary
  },
  updatePrice(
    state: State,
    { chain, body }: { chain: Chains; body: PriceData }
  ) {
    state.prices[chain] = _.cloneDeep(body) // I'am not sure this is necessary
  },
}

export const getters: GetterTree<State, any> = {
  getReserveData: (state: State) => (chain: Chains) => {
      return !_.isEmpty(state.prices[chain]) ? state.prices[chain] : null
    },
}

