// import { ActionContext } from "vuex";
import _ from 'lodash'
import { WalletProvider } from '~/components/utils'
import { Commit, GetterTree, ActionTree } from "vuex";
import { WalletBody } from "./types"

type State = {
  [key in WalletProvider]: WalletBody
}

export function isWalletEqual(walletA: WalletBody, walletB: WalletBody) {
  const props = ['address', 'provider', 'wallet.label']

  for (const prop of props) {
    const [valueA, valueB] = [_.get(walletA, prop), _.get(walletB, prop)]

    if (valueA !== valueB) {
      return false
    }
  }

  return true
}

export const buildWallet = (provider = null): WalletBody => {
  return {
    provider,
    checked: false,
    isConnected: false,
    address: "",
    wallet: {
      label: "",
      id: 0
    }
  }
}

export const state = () => {
  return {
    [WalletProvider.Metamask]: buildWallet(),
    [WalletProvider.Phantom]: buildWallet(),
  }
}

export const actions: ActionTree<State, any> = {
  disconnectWallet({ commit }: {commit: Commit}, { provider }: {provider: WalletProvider}) {
    const metamask = buildWallet()

    commit('updateWalletData', {
      provider,
      body: metamask,
    })
  },
}

export const mutations = {
  updateWalletData(state: State, { provider, body }: {provider: WalletProvider, body: WalletBody}) {
    state[provider].checked = false

    state[provider] = {
      ...state[provider],
      ...body,
    }
  },
}

export const getters: GetterTree<State, any> = {
  walletByName: (state: State) => (name: WalletProvider) => {
    return state[name] && state[name].checked ? state[name] : null
  },
  currentWallet: (state: State) => {
    // we look through available wallets and take the first one that is logged
    for (const wallet of Object.keys(state)) {
       //@ts-ignore
      if (state[wallet] && state[wallet].checked) {
       //@ts-ignore
        return state[wallet]
      }
    }
    return null
  },
  isWalletAvailableByName: (_, getters) => (name: WalletProvider) => {
    return Boolean(getters.walletByName(name))
  },
  isWalletAvailable: (_, getters) => Boolean(getters.currentWallet),
}
