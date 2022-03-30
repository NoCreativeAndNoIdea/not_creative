import _Swipe from './Swipe'
import { withInstall } from '~/utils/withInstall'
export * from './type'

import './swipe.scss'

const Swipe = withInstall(_Swipe)

export default Swipe

declare module 'vue' {
  export interface GlobalComponents {
    Swipe: typeof Swipe
  }
}
