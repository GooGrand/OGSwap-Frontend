import { Plugin } from '@nuxt/types'
import Web3 from 'web3'

import { Web3WalletConnector } from '~/web3/metamask'

const { HttpProvider } = Web3.providers

export function createEvmInstance(endpoint: string): Web3 {
  return new Web3(new HttpProvider(endpoint))
}
interface Web3Invoker {
  mmWeb3(): Web3
  mmProvider(): any
}

declare module 'vue/types/vue' {
  interface Vue {
    $web3: Web3Invoker
  }
}

const connector = new Web3WalletConnector()
const invoker: Web3Invoker = {
  mmProvider() {
    connector.ethEnabled()
    return window.ethereum
  },
  mmWeb3() {
    connector.ethEnabled()
    return new Web3(window.ethereum)
  },
}

const web3Plugin: Plugin = (_, inject) => {
  inject('web3', invoker)
}

export default web3Plugin
