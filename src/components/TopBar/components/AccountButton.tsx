import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import { getAccount, getWeb3 } from '../../../rai/Rai'
import { useCookies } from 'react-cookie'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )
  const [account, setAccount] = useState(undefined)
  const [cookies, setCookie, removeCookie] = useCookies(['userAccount'])

  // useEffect(() => {
  //   if (!cookies.hasOwnProperty('userAccount')) setCookie('userAccount', null)
  //   if (!cookies.hasOwnProperty('userEthBalance'))
  //     setCookie('userEthBalance', null)
  // }, [cookies, setCookie])

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
      setCookie('userAccount', result.coinbase)
      setCookie('userEthBalance', result.balance)
    } catch (err) {
      // MARK: Print error when an err occurred.
      console.error(err)
    }
  }, [onPresentWalletProviderModal])

  console.log(`AccountButton.tsx -> account =>`, account, typeof account)
  return (
    <StyledAccountButton>
      {account === undefined ? (
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
