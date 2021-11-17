import { Connection, PublicKey } from '@solana/web3.js'
import { Plugin } from '@nuxt/types'
import { Chains, RelayToken } from '~/components/constants'
import Web3 from 'web3'
import { get } from 'lodash'
import { AbiItem } from 'web3-utils'
import { ChainTypes, toPlainString } from '~/components/utils'
import { MetamaskChain } from '~/web3/evm_chain'
import { routerAddresses, contractsABI, wrappedNatives, gtonOnChain } from '~/web3/constants'
import {
  prepare_swap,
  transfer,
  requestInfos,
  getTokenAccounts,
  setupAnchorProvider,
  prepareDataForTransfer,
} from '~/utils/swap'
import { setUpcomingTxn, sendDataToOracle } from '~/utils/oracle'
import { getSwapOutAmount, GTON, NATIVE_SOL, TokenAmount } from '~/utils/tokens'

const { HttpProvider } = Web3.providers

export function createEvmInstance(endpoint: string): Web3 {
  return new Web3(new HttpProvider(endpoint))
}
function createMetamaskInstance(): Web3 {
  return new Web3(window.ethereum)
}

const createSolInstance = (endpoint: string) => {
  const web3 = new Connection(endpoint)
  return web3
}

declare module 'vue/types/vue' {
  interface Vue {
    $web3: Web3Invoker
  }
}

type Web3Function = (params?: Object) => Promise<string> | null
type Web3Network = (params?: Object) => Promise<Chains>
type Web3Swap = (params?: Object) => Promise<Array<any>>

interface FunctionPack {
  [ChainTypes.Evm]: any
  [ChainTypes.Solana]: any
}

interface Web3Invoker {
  makeSwap(type: ChainTypes, params: Object): Web3Swap
  makeOnchainSwap(type: ChainTypes, params: Object): Web3Swap;
  resolveCurrentAddress(type: ChainTypes): Web3Function
  getNetworkVersion(type: ChainTypes): Web3Network
  switchNetwork(chain: MetamaskChain): void
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

function toHexString(byteArray: Uint8Array) {
  var s = '0x'
  byteArray.forEach(function (byte) {
    s += ('0' + (byte & 0xff).toString(16)).slice(-2)
  })
  return s
}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16))
  return bytes
}

async function makeOnchainSwapEvm(params: RelaySwapData): Promise<string> {
  const { destination, addressTo, value, userAddress, chainId, tokenFrom, tokenTo } = params
  const okexRouterAddress = "0xaaDF3BfaF9D9AEFaC31D25814dAc8DEF1a7e4438"
  const web3 = createMetamaskInstance()
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
    .swapExactTokensForETH(valueToSend,0, path, userAddress, 15000000000)
    .send({ from: userAddress })
  }
  return firstTxn
}

async function makeSwapEvm(params: RelaySwapData): Promise<string> {
  const { destination, addressTo, value, userAddress, chainId, tokenFrom, tokenTo } = params
  const valueToSend = toPlainString(new TokenAmount(value, 18, false).toWei().toNumber())
  const receiveTokenAddress = hexToBytes(tokenTo.address.substring(2))
  const bytes = hexToBytes(addressTo.substring(2)).concat(receiveTokenAddress)
  //@ts-ignore
  const contractAddress = routerAddresses[chainId]
  const path = [tokenFrom.address, gtonOnChain[chainId]]
  
  const web3 = createMetamaskInstance()
  const contract = new web3.eth.Contract(
    contractsABI.OgRouter as AbiItem[],
    contractAddress
  )
  const firstTxn = await contract.methods
    .crossChainFromEth(0, destination, 0, path, bytes)
    .send({ from: userAddress, value: valueToSend })
  return firstTxn.transactionHash
}
async function makeSwapSol(params: RelaySwapData): Promise<Array<any>> {
  const { destination, addressTo, value, userAddress, chainId } = params
  const endpoint = 'https://solana-api.projectserum.com'
  const connection = createSolInstance(endpoint)
  const ammId = 'J8r2dynpYQuH6S415SPEdGuBGPmwgNuyfbxt1T371Myi'
  const infos = await requestInfos(connection) // NEED TO DECOMPOSE THE function to update only one pool
  const owner = window.solana.publicKey
  // @ts-ignore
  // const poolInfo = gtonPoolInfo
  const poolInfo = Object.values(infos).find((p) => p.ammId === ammId)
  const baseMint = GTON.mintAddress
  const quoteMint = NATIVE_SOL.mintAddress
  const data = await getTokenAccounts(connection, owner)
  const baseAccount = get(data.tokenAccounts, `${baseMint}.tokenAccountAddress`) // from token user account
  const quoteAccount = get(
    data.tokenAccounts,
    `${quoteMint}.tokenAccountAddress`
  ) // to token user account
  const toCoinWithSlippage = getSwapOutAmount(
    poolInfo,
    quoteMint,
    baseMint,
    value,
    0.5
  )
  const [txn, signers] = await prepare_swap(
    connection,
    owner,
    poolInfo,
    quoteMint,
    baseMint,
    quoteAccount,
    baseAccount,
    value,
    toCoinWithSlippage.amountOutWithSlippage.fixed()
  )
  txn.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
  txn.feePayer = owner
  if (signers.length > 0) {
    for (const signer of signers) {
      txn.sign(signer)
    }
  }
  const signedTxn = await window.solana.signTransaction(txn)
  //@ts-ignores
  const txnId = await connection.sendRawTransaction(signedTxn.serialize())
  const provider = setupAnchorProvider(connection, window.solana)
  const transferData = prepareDataForTransfer(
    addressTo,
    destination,
    toCoinWithSlippage.amountOutWithSlippage.toWei().toNumber()
  )
  const [transferTxnId, dataAcc] = await transfer(
    window.solana.publicKey,
    provider,
    transferData
  )
  try {
    const res = await setUpcomingTxn(dataAcc)
  } catch (e) {
    console.log(e)
  }
  return [transferTxnId, toCoinWithSlippage.amountOutWithSlippage.fixed()]
}

async function resolveAdrressEvm(): Promise<string> {
  await window.ethereum.enable()
  const addressList = await window.ethereum.request({
    method: 'eth_accounts',
  })
  return addressList[0].toLowerCase()
}

const chainToName = {
  // дополнить мапинг всеми сетями
  '250': Chains.Ftm,
  '56': Chains.Bsc,
  '1': Chains.Eth,
  '100': Chains.Xdai,
  '128': Chains.Heco,
  '43114': Chains.Avax,
  '137': Chains.Pol,
}

async function getNetworkVersionEvm(): Promise<number> {
  let res = await window.ethereum.request({ method: 'eth_chainId' })
  // attempt to convert the value we get from mm method to our inner Chains type
  // const stringifiedCHain = String(parseInt(res, 16));
  // const typedChain = chainToName[stringifiedCHain] as keyof typeof chainToName;
  const typeChainId = parseInt(res, 16)
  return typeChainId
}

async function resolveAdrressSol(): Promise<string> {
  if (!window.solana.publicKey) return ''
  return window.solana.publicKey.toString()
}

const makeSwap: FunctionPack = {
  [ChainTypes.Evm]: makeSwapEvm,
  [ChainTypes.Solana]: makeSwapSol,
}

const makeOnchainSwap: FunctionPack = {
  [ChainTypes.Evm]: makeOnchainSwapEvm,
  [ChainTypes.Solana]: async () => '',
}

const resolveAddress: FunctionPack = {
  [ChainTypes.Evm]: resolveAdrressEvm,
  [ChainTypes.Solana]: resolveAdrressSol,
}

const getNetworkVersion: FunctionPack = {
  [ChainTypes.Evm]: getNetworkVersionEvm,
  [ChainTypes.Solana]: async () => Chains.Eth,
}

const invoker: Web3Invoker = {
  makeSwap(type: ChainTypes, params: Object) {
    return async function () {
      return makeSwap[type](params)
    }
  },
  makeOnchainSwap(type: ChainTypes, params: Object) {
    return async function () {
      return makeOnchainSwap[type](params)
    }
  },
  resolveCurrentAddress(type: ChainTypes) {
    return resolveAddress[type]
  },
  getNetworkVersion(type: ChainTypes) {
    return async function () {
      return await getNetworkVersion[type]()
    }
  },
  async switchNetwork(chain: MetamaskChain) {
    let { chainIdHex, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } =
      chain
    if (chainIdHex === '0x1') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainIdHex,
          },
        ],
      })
      return
    }
    await window.ethereum.request({
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
  },
}

const web3Plugin: Plugin = async (ctx, inject) => {
  inject('web3', invoker)
}

// interaction if  format like
// function (type: string) {
//  return
// }

export default web3Plugin
