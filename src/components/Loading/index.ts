import { withInstall } from '~/utils/withInstall'
import _Loading from './Loading'
import './loading.scss'

export const Loading = withInstall(_Loading)
export * from './type'
export default Loading

declare module 'vue' {
  export interface GlobalComponents {
    Loading: typeof Loading
  }
}
