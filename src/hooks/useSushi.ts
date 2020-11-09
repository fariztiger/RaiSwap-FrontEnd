import { useContext } from 'react'
import { Context } from '../contexts/RaiProvider'

const useSushi = () => {
  const { rai } = useContext(Context)
  return rai
}

export default useSushi
