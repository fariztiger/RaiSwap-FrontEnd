import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import { getAccount, getBalance, getWeb3 } from '../../../rai/Rai'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )
  const [account, setAccount] = useState(null)

  useEffect(() => {
    function fetchAccount() {
      const account = localStorage.getItem('userAccount')
      setAccount(account)
    }

    fetchAccount()
  })

  const handleUnlockClick = useCallback(async () => {
    // onPresentWalletProviderModal()
    console.log('Called handleUnlockClick()!')
    try {
      // @ts-ignore
      const result: {
        networkId: number
        coinbase: string
        balance: string
      } = await getWeb3()
      console.log(JSON.stringify(result))
      // setAccount(result.coinbase)
      setAccount(() => result.coinbase)
      localStorage.setItem('userAccount', result.coinbase)
      localStorage.setItem('userEthBalance', result.balance)
    } catch (err) {
      // MARK: Print error when an err occurred.
      console.error(err)
    }
  }, [onPresentWalletProviderModal])
  return (
    <StyledAccountButton>
      {account == null ? (
        <Button onClick={handleUnlockClick} size="sm" text="Unlock Wallet" />
      ) : (
        // <Button
        //   onClick={async () => {
        //     console.log('Called onConnect!')
        //     try {
        //       // @ts-ignore
        //       const result: {
        //         networkId: number
        //         coinbase: string
        //         balance: string
        //       } = await getWeb3()
        //       console.log(JSON.stringify(result))
        //     } catch (err) {
        //       // MARK: Print error when an err occurred.
        //       console.error(err)
        //     }
        //   }}
        //   size="sm"
        //   text="Unlock Wallet"
        // />
        <Button onClick={onPresentAccountModal} size="sm" text="My Wallet" />
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AccountButton
