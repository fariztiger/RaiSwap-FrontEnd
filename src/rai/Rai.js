import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { Contracts } from './lib/contracts.js'
import { Account } from './lib/accounts.js'
import { EVM } from './lib/evm.js'

import { contractAddresses } from './lib/constants'

export class Rai {
  constructor(provider, networkId, testing, options) {
    const realProvider =
      typeof provider === 'string'
        ? provider.includes('wss://')
          ? new Web3.providers.WebsocketProvider(provider, {
              timeout: options.ethereumNodeTimeout || 10000,
            })
          : new Web3.providers.HttpProvider(provider, {
              timeout: options.ethereumNodeTimeout || 10000,
            })
        : provider

    this.web3 = new Web3(realProvider)

    if (testing) {
      this.testing = new EVM(realProvider)
      this.snapshot = this.testing.snapshot()
    }

    if (options.defaultAccount) {
      this.web3.eth.defaultAccount = options.defaultAccount
    }
    this.contracts = new Contracts(realProvider, networkId, this.web3, options)
    this.sushiAddress = contractAddresses.sushi[networkId]
    this.masterChefAddress = contractAddresses.masterChef[networkId]
    this.wethAddress = contractAddresses.weth[networkId]
  }

  async resetEVM() {
    this.testing.resetEVM(this.snapshot)
  }

  addAccount(address, number) {
    this.accounts.push(new Account(this.contracts, address, number))
  }

  setProvider(provider, networkId) {
    this.web3.setProvider(provider)
    this.contracts.setProvider(provider, networkId)
    this.operation.setNetworkId(networkId)
  }

  setDefaultAccount(account) {
    this.web3.eth.defaultAccount = account
    this.contracts.setDefaultAccount(account)
  }

  getDefaultAccount() {
    return this.web3.eth.defaultAccount
  }

  loadAccount(account) {
    const newAccount = this.web3.eth.accounts.wallet.add(account.privateKey)

    if (
      !newAccount ||
      (account.address &&
        account.address.toLowerCase() !== newAccount.address.toLowerCase())
    ) {
      throw new Error(`Loaded account address mismatch.
        Expected ${account.address}, got ${
        newAccount ? newAccount.address : null
      }`)
    }
  }

  toBigN(a) {
    return BigNumber(a)
  }
}

let account = null
let balance = null

export const getWeb3 = async () => {
  const web3js = window.web3
  if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    let data = {}
    // MARK: Connect with Metamask
    // Stage 01 : Initializing Metamask. (== Requesting to connect on Metamask)
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)
      try {
        await window.ethereum.enable()
        data = {
          injectedWeb3: web3.isConnected,
          web3() {
            return web3
          },
        }
      } catch (err) {
        throw new Error(
          'Failed to connect to Metamask : ' + JSON.stringify(err),
        )
      }
    } else {
      const web3 = new Web3(web3js.currentProvider)
      data = {
        injectedWeb3: web3.isConnected,
        web3() {
          return web3
        },
      }
    }
    // Stage 02 : Get current network's networkId.
    try {
      data.networkId = await data.web3().eth.net.getId()
    } catch (err) {
      throw new Error('Unable to retrieve networkID')
    }
    // Stage 03 : Get Coinbase WalletID.
    try {
      data.coinbase = await data.web3().eth.getCoinbase()
      setAccount(data.coinbase)
    } catch (err) {
      throw new Error('Unable to retrieve coinbase')
    }
    // Stage 04 : Get Balance of the Coinbase in Current Network.
    try {
      data.balance = await data.web3().eth.getBalance(data.coinbase)
      balance = data.balance
      setBalance(data.balance)
    } catch (err) {
      throw new Error(
        'Unable to retrieve balance for address: ' + data.coinbase,
      )
    }
    return data
  } else throw new Error('Unable to connect to Metamask')
}

export const getAccount = () => account
export const setAccount = (_account) => {
  account = _account
}
export const getBalance = () => balance
export const setBalance = (_balance) => {
  balance = _balance
}
