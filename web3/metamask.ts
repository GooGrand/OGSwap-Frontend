import { AbiItem } from 'web3-utils'
import Web3 from 'web3'
import { relayAddresses, contractsABI, gtonOnChain } from './constants'
import { Chains, RelayToken } from '~/components/constants'
import { MetamaskChain } from '~/web3/evm_chain'
import { toPlainString } from '~/components/utils'
import { TokenAmount } from '~/utils/safe-math'

function hexToBytes(hex: string) {
  let bytes
  let c
  for (bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16))
  return bytes
}

declare global {
  interface Window {
    ethereum: any
    solana: any
    web3: any
  }
}
const { HttpProvider } = Web3.providers

class Invoker {
  async switchNetwork(provider: any, chain: MetamaskChain) {
    const { chainIdHex, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } =
      chain
    if (chainIdHex === '0x1') {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainIdHex,
          },
        ],
      })
      return
    }
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainIdHex,
          chainName,
          rpcUrls,
          nativeCurrency,
          blockExplorerUrls,
        },
      ],
    })
  }

  async getNetworkVersion(web3: Web3): Promise<Chains> {
    return String(await web3.eth.net.getId()) as Chains
  }

  async resolveCurrentAddress(web3: Web3) {
    const accounts = await web3.eth.getAccounts()
    return accounts[0].toLowerCase()
  }
}

export interface RelaySwapData {
  destination: string
  userAddress: string
  addressTo: string
  tokenTo: RelayToken
  tokenFrom: RelayToken
  value: string
  chainId: Chains
}

export class Web3Invoker extends Invoker {
  relayAddresses = relayAddresses
  contractsABI = contractsABI
  routerAddress = ""

  async getAmountOut(web3: Web3, amount: string, path: string[]) {
    const contract = new web3.eth.Contract(
      contractsABI.UniswapRouter as AbiItem[],
      this.routerAddress
    )
    const res = await contract.methods.getAmountsOut(amount, path)
    return res
  }

  async getErc20TokenBalance(web3: Web3, tokenAddress: string, userAddress: string) {
    const contract = new web3.eth.Contract(
      this.contractsABI.ERC20ABI as AbiItem[],
      tokenAddress
    )
    const res = await contract.methods
      .balanceOf(userAddress)
      .call()
    return res

  }

  async getChainBalance(nodeUrl: string, address: string): Promise<number> {
    const web3 = new Web3(new HttpProvider(nodeUrl))
    const res = await web3.eth.getBalance(address)
    return Number(web3.utils.fromWei(res))
  }

  async getLastBlock(nodeUrl: string): Promise<number> {
    const web3 = new Web3(new HttpProvider(nodeUrl))
    return await web3.eth.getBlockNumber()
  }

  async makeOnchainSwapEvm(web3: Web3, params: RelaySwapData): Promise<string> {
    const { destination, addressTo, value, userAddress, chainId, tokenFrom, tokenTo } = params
    const okexRouterAddress = "0xaaDF3BfaF9D9AEFaC31D25814dAc8DEF1a7e4438"
    const contract = new web3.eth.Contract(
      contractsABI.UniswapRouter as AbiItem[],
      okexRouterAddress
    )
    const valueToSend = toPlainString(new TokenAmount(value, 18, false).toWei().toNumber())
    const path = [tokenFrom.address, gtonOnChain[chainId], tokenTo.address]
    let firstTxn
    if (tokenFrom.native) {
      firstTxn = await contract.methods
        .swapExactETHForTokens(0, path, userAddress, 15000000000)
        .send({ from: userAddress, value: valueToSend })
    } else {
      const tokenContract = new web3.eth.Contract(
        contractsABI.ERC20ABI as AbiItem[],
        tokenFrom.address
      )
      const approve = await tokenContract.methods.approve(okexRouterAddress, valueToSend).send({ from: userAddress });
      firstTxn = await contract.methods
        .swapExactTokensForETH(valueToSend, 0, path, userAddress, 15000000000)
        .send({ from: userAddress })
    }
    return firstTxn
  }

  async makeSwapEvm(web3: Web3, params: RelaySwapData): Promise<string> {
    const { destination, addressTo, value, userAddress, chainId, tokenFrom, tokenTo } = params
    const valueToSend = toPlainString(new TokenAmount(value, 18, false).toWei().toNumber())
    const receiveTokenAddress = hexToBytes(tokenTo.address.substring(2))
    const bytes = hexToBytes(addressTo.substring(2)).concat(receiveTokenAddress)
    //@ts-ignore
    const contractAddress = routerAddresses[chainId]
    const path = [tokenFrom.address, gtonOnChain[chainId]]

    const contract = new web3.eth.Contract(
      contractsABI.OgRouter as AbiItem[],
      contractAddress
    )
    let firstTxn
    if (tokenFrom.native) {
      firstTxn = await contract.methods
        .crossChainFromEth(0, destination, 0, path, bytes)
        .send({ from: userAddress, value: valueToSend })
    } else {
      const tokenContract = new web3.eth.Contract(
        contractsABI.ERC20ABI as AbiItem[],
        tokenFrom.address
      )
      const approve = await tokenContract.methods.approve(contractAddress, valueToSend).send({ from: userAddress });
      firstTxn = await contract.methods
        .crossChain(0, destination, valueToSend, 0, userAddress, path, bytes)
        .send({ from: userAddress })
    }
    return firstTxn.transactionHash
  }
}

export class Web3WalletConnector {
  ethEnabled(): boolean {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.ethereum.enable()
      return true
    }
    return false
  }

  async solEnabled(): Promise<boolean> {
    if (window.solana) {
      if (window.solana.isPhantom) {
        await window.solana.connect()
        return true
      }
    }
    return false
  }
}

export function formatETHBalance(amount: string): string {
  const web3 = new Web3()
  return web3.utils.fromWei(amount, 'ether')
}

export function formatAmountToPrecision(
  value: string,
  precision: number
): string {
  let dotAt = value.indexOf('.')
  return dotAt !== -1 ? value.slice(0, ++dotAt + precision) : value
}
