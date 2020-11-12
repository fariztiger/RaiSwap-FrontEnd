import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/chef.png'

import { useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import Page from '../../components/Page'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import useSushi from '../../hooks/useSushi'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import { getContract } from '../../utils/erc20'
import { getMasterChefContract } from '../../rai/utils'

import Harvest from './components/Harvest'
import Stake from './components/Stake'
import { getWeb3 } from '../../rai/Rai'
import { useCookies } from 'react-cookie'

const Farm: React.FC = () => {
  const [account, setAccount] = useState(undefined)
  const [cookies, setCookie, removeCookie] = useCookies(['userAccount'])
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    setAccount(cookies['userAccount'])
  })
  // if (account === undefined) setAccount(cookies['userAccount'])

  const sushi = useSushi()
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

  return (
    <Page>
      {account ? (
        <>
          <PageHeader
            icon={<img src={chef} height="120" />}
            title="Stake Sushi Tokens & Earn Fees"
            subtitle="0.05% of all SushiSwap trades are rewarded to SUSHI stakers"
          />
          {/* <FarmCards /> */}
          <div>TBD</div>
        </>
      ) : (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Button onClick={handleUnlockClick} text="🔓 Unlock Wallet" />
        </div>
      )}
    </Page>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
