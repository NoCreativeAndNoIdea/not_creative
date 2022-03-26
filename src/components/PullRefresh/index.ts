import { withInstall } from '~/utils/withInstall'
import _PullRefresh from './pullRefresh'
import './pullRefresh.scss'

export const PullRefresh = withInstall(_PullRefresh)
export default PullRefresh
export type { PullRefreshProps } from './type'

declare module 'vue' {
  export interface GlobalComponents {
    PullRefresh: typeof PullRefresh
  }
}
