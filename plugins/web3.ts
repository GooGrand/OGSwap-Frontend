import { Connection, PublicKey } from '@solana/web3.js'
import { Plugin } from '@nuxt/types'
import { Chains } from '~/components/constants'
import Web3 from 'web3'
import { get } from "lodash"
import { AbiItem } from 'web3-utils'
import { ChainTypes } from '~/components/utils'
import { MetamaskChain } from '~/web3/evm_chain'
import { routerAddresses, contractsABI, wrappedNatives } from '~/web3/constants'
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
import { gtonPoolInfo } from '~/utils/constants'

const { HttpProvider } = Web3.providers

function createEvmInstance(endpoint: string): Web3 {
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
  resolveCurrentAddress(type: ChainTypes): Web3Function
  getNetworkVersion(type: ChainTypes): Web3Network
  switchNetwork(chain: MetamaskChain): void
}

export interface RelaySwapData {
  destination: string
  userAddress: string
  addressTo: string
  value: string
  chainId: Chains
}

function toHexString(byteArray: Uint8Array) {
  var s = '0x';
  byteArray.forEach(function(byte) {
    s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
  return s;
}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

async function makeSwapEvm(params: RelaySwapData): Promise<string> {
  console.log(params);
  const { destination, addressTo, value, userAddress, chainId } = params
  const valueToSend = new TokenAmount(value, 18, false).toWei().toString();
  console.log(valueToSend);
  const receiveTokenAddress = hexToBytes(wrappedNatives[destination]);
  const bytes = hexToBytes(addressTo.substring(2)).concat(receiveTokenAddress)
  //@ts-ignore
  const contractAddress = routerAddresses[chainId]
  const web3 = createMetamaskInstance()
  const contract = new web3.eth.Contract(
    contractsABI.OgRouter as AbiItem[],
    contractAddress
  )
  const firstTxn = await contract.methods
    .crossChainFromEth(0, destination, valueToSend, bytes)
    .send({ from: userAddress, value: valueToSend })
  const secondTxn = await sendDataToOracle(firstTxn, Number(destination))
  // @ts-ignore
  return {firstTxn, secondTxn}
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
  const baseAccount = get(data.tokenAccounts, `${baseMint}.tokenAccountAddress`)// from token user account
  const quoteAccount = get(data.tokenAccounts, `${quoteMint}.tokenAccountAddress`) // to token user account
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
  txn.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  txn.feePayer = owner;
  if (signers.length > 0) {
    for (const signer of signers) {
      txn.sign(signer)
    }
  }
  const signedTxn = await window.solana.signTransaction(txn)
  console.log(signedTxn); // we need this to debug
  //@ts-ignores
  const txnId = await connection.sendRawTransaction(signedTxn.serialize())
  console.log(txnId)
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
  if(!window.solana.publicKey) return ""
  return window.solana.publicKey.toString()
}

const makeSwap: FunctionPack = {
  [ChainTypes.Evm]: makeSwapEvm,
  [ChainTypes.Solana]: makeSwapSol,
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
