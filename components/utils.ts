import BigNumber from 'bignumber.js'

/**
 * We need to estimate all evm chains we can use in project
 */
export enum EvmChains {
  Fantom,
  Ethereum,
  Polygon,
  Binance,
  Xdai,
  Heco,
  Avax,
}

export enum WalletProvider {
  Metamask,
  Phantom,
}

export enum ChainTypes {
  Evm,
  Solana,
}

export interface Token {
  
}

/**
 * Functions to operate basic convertion operations from 18dec and back
 */
const pow = new BigNumber(10).exponentiatedBy(18)

export function fromWei(v: BigNumber): BigNumber {
  return v.dividedBy(pow)
}

export function toWei(v: BigNumber): BigNumber {
  return v.multipliedBy(pow)
}
/**
 * Function to convert number with scientific notation to plain number
 *
 * @param num number convreted to string
 * @returns string
 */
 export function toPlainString(num: number): string {
  return num.toLocaleString('fullwide', { useGrouping: false })
}

export function numberWithCommas(x: string): string {
  var parts = x.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}
